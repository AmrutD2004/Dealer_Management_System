import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";
import GetFiscalYear from "get-fiscal-year";
import dayjs from "dayjs";
import { Prisma } from "../../generated/prisma/client";

export const createMRN = async (req: Request, res: Response) => {
    const { id, tenantId, branchId } = req.user!;
    const {
        storeId, mrnDate, mrnType, purchaseType, partyType,
        partyCode, partyName, dcNo, dcDate, invoiceNo, invoiceDate, parts
    } = req.body;

    if (!id || !tenantId || !branchId) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    if (!storeId || !mrnDate || !mrnType || !purchaseType || !parts) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (!Array.isArray(parts) || parts.length === 0) {
        return res.status(400).json({ success: false, message: 'Parts data should be a non-empty array' });
    }

    try {

        const isTenantExists = await prisma.tenant.findUnique({ where: { id: Number(tenantId) } });
        if (!isTenantExists) return res.status(403).json({ success: false, message: 'Tenant not exists' });

        const isBranchExists = await prisma.branch.findFirst({
            where: { id: Number(branchId), tenantId: Number(tenantId) }
        });
        if (!isBranchExists) return res.status(403).json({ success: false, message: 'Branch not exists in tenant' });

        const isStoreExists = await prisma.storeMaster.findFirst({
            where: { id: Number(storeId), tenantId: Number(tenantId), branchId: Number(branchId) }
        });
        if (!isStoreExists) return res.status(403).json({ success: false, message: 'Store not exists in branch' });

        const partsIds = parts.map((p: any) => Number(p.branchPartId));
        const existingBranchParts = await prisma.branchPartMaster.findMany({
            where: {
                id: { in: partsIds },
                tenantId: Number(tenantId),
                branchId: Number(branchId)
            }
        });

        // Check if all provided IDs actually exist in this branch
        if (existingBranchParts.length !== partsIds.length) {
            return res.status(403).json({ success: false, message: 'One or more Parts do not exist in this branch' });
        }

        // 3. Generate MRN Number
        const get = new GetFiscalYear();
        const Years = get.getFiscalYear("IN", "current");
        const current = dayjs(Years.fiscalYearStart.split('T')[0]).format('YY');
        const next = dayjs(Years.fiscalYearEnd.split('T')[0]).format('YY');
        const fiscalYear = `${current}${next}`;
        const prefix = `MRN${isBranchExists.branchCode}${fiscalYear}`;

        const lastMRN = await prisma.mRNMaster.findFirst({
            where: { tenantId: Number(tenantId), branchId: Number(branchId), mrnNo: { startsWith: prefix } },
            orderBy: { mrnNo: 'desc' },
            select: { mrnNo: true },
        });

        let lastSeq = 0;
        if (lastMRN) {
            const sequencePart = lastMRN.mrnNo.slice(prefix.length);
            lastSeq = Number(sequencePart);
            if (!/^\d{9}$/.test(sequencePart) || !Number.isSafeInteger(lastSeq)) {
                throw new Error("Invalid existing MRN number sequence");
            }
        }
        const mrnNo = `${prefix}${(lastSeq + 1).toString().padStart(9, '0')}`;

        // 4. Prepare Math & Details
        let totalTaxable = new Prisma.Decimal(0);
        let totalDiscount = new Prisma.Decimal(0);
        let totalInvoiceVal = new Prisma.Decimal(0);
        let totalMRNVal = new Prisma.Decimal(0);

        const mrnDetails = parts.map((d: any) => {

            const rate = new Prisma.Decimal(d.rate || 0);
            const qty = new Prisma.Decimal(d.invQuantity || d.invoiceQty || 0);
            const discount = new Prisma.Decimal(d.discount || 0);
            const tax = new Prisma.Decimal(d.taxAmount || d.tax || 0);
            const taxRate = new Prisma.Decimal(d.taxRate || 0);

            const lineTotal = qty.mul(rate).minus(discount).plus(tax);

            totalTaxable = totalTaxable.plus(qty.mul(rate));
            totalDiscount = totalDiscount.plus(discount);
            totalInvoiceVal = totalInvoiceVal.plus(qty.mul(rate).minus(discount));
            totalMRNVal = totalMRNVal.plus(lineTotal);

            return {
                tenantId: Number(tenantId),
                branchId: Number(branchId),
                branchPartId: Number(d.branchPartId),
                binId: Number(d.binId),
                invoiceQty: qty,
                receivedQty: new Prisma.Decimal(d.receivedQty || 0),
                shortQty: new Prisma.Decimal(d.shortQty || 0),
                damageQty: new Prisma.Decimal(d.damageQty || 0),
                excessQty: new Prisma.Decimal(d.excessQty || 0),
                rate: rate,
                discount: discount,
                taxRate: taxRate,
                taxAmount: tax,
                lineTotal: lineTotal,
                reason: d.reason || null,
                isReceived: Number(d.receivedQty || 0) > 0
            };
        });

        const result = await prisma.$transaction(async (tx) => {
            const mrn = await tx.mRNMaster.create({
                data: {
                    storeId: Number(storeId),
                    tenantId: Number(tenantId),
                    branchId: Number(branchId),
                    mrnNo: mrnNo,
                    mrnDate: new Date(mrnDate),
                    mrnType: mrnType,
                    purchaseType: purchaseType,
                    partyType: partyType || null,
                    partyCode: partyCode || null,
                    partyName: partyName || null,
                    dcNo: dcNo || null,
                    dcDate: dcDate ? new Date(dcDate) : null,
                    invoiceNo: invoiceNo || null,
                    invoiceDate: invoiceDate ? new Date(invoiceDate) : null,
                    totalTaxableValue: totalTaxable,
                    totalDiscountValue: totalDiscount,
                    totalInvoiceValue: totalInvoiceVal,
                    totalMRNValue: totalMRNVal,
                    createdById: Number(id),
                    updatedById: Number(id),
                    mrnDetails: {
                        create: mrnDetails
                    }
                },
                include: {
                    mrnDetails: true
                }
            });
            return mrn;
        });

        // 6. Success Response
        return res.status(201).json({
            success: true,
            message: `${result.mrnNo} MRN created successfully with ${result.mrnDetails.length} items`,
            data: result
        });

    } catch (err: any) {
        console.error("MRN Creation Error:", err);
        return res.status(500).json({
            success: false,
            message: `Server Error: ${err.message || err}`
        });
    }
};


export const getListOfMRNS = async (req: Request, res: Response) => {
    const { id, tenantId, branchId } = req.user!;
    const { skip, take } = req.query;
    if (!id || !tenantId || !branchId) {
        return res.status(401).json({ success: false, message: 'Not authorized' });
    }
    try {
        const isTenantExists = await prisma.tenant.findUnique({ where: { id: Number(tenantId) } });
        if (!isTenantExists) return res.status(403).json({ success: false, message: 'Tenant not exists' });

        const isBranchExists = await prisma.branch.findFirst({
            where: { id: Number(branchId), tenantId: Number(tenantId) }
        });
        if (!isBranchExists) return res.status(403).json({ success: false, message: 'Branch not exists in tenant' });

        let listOfMrns
        const totalMrn = await prisma.mRNMaster.count({
            where: {
                tenantId: Number(tenantId),
                branchId: Number(branchId)
            }
        })
        if (skip || take) {
            listOfMrns = await prisma.mRNMaster.findMany({
                skip: Number(skip),
                take: Number(take),
                where: {
                    tenantId: Number(tenantId),
                    branchId: Number(branchId)
                },
                include: {
                    store: {
                        include: { bins: true }
                    },
                    createdBy: {
                        select: {
                            firstName: true,
                            middleName: true,
                            mobileNo: true,
                            employeeCode: true,
                            lastName: true,

                        }
                    },
                    updatedBy: {
                        select: {
                            firstName: true,
                            middleName: true,
                            mobileNo: true,
                            employeeCode: true,
                            lastName: true,

                        }
                    },
                    mrnDetails: {
                        select: {
                            id: true,
                            branchPartId: true,
                            binId: true,
                            invoiceQty: true,
                            receivedQty: true,
                            shortQty: true,
                            damageQty: true,
                            excessQty: true,
                            rate: true,
                            discount: true,
                            taxRate: true,
                            taxAmount: true,
                            lineTotal: true,
                            reason: true,
                            isReceived: true,
                            branchPart: {
                                include: { part: true }
                            }
                        }
                    }
                }
            })
        }
        listOfMrns = await prisma.mRNMaster.findMany({
            where: {
                tenantId: Number(tenantId),
                branchId: Number(branchId)
            },
            include: {
                store: {
                    include: { bins: true }
                },
                createdBy: {
                    select: {
                        firstName: true,
                        middleName: true,
                        mobileNo: true,
                        employeeCode: true,
                        lastName: true,

                    }
                },
                updatedBy: {
                    select: {
                        firstName: true,
                        middleName: true,
                        mobileNo: true,
                        employeeCode: true,
                        lastName: true,

                    }
                },
                mrnDetails: {
                    select: {
                        id: true,
                        branchPartId: true,
                        binId: true,
                        invoiceQty: true,
                        receivedQty: true,
                        shortQty: true,
                        damageQty: true,
                        excessQty: true,
                        rate: true,
                        discount: true,
                        taxRate: true,
                        taxAmount: true,
                        lineTotal: true,
                        reason: true,
                        isReceived: true,
                        branchPart: {
                            include: { part: true }
                        }
                    }
                }
            }
        })

        return res.status(200).json({
            success : true,
            data : listOfMrns,
            count : totalMrn
        })
    } catch (err: any) {
        return res.status(500).json({
            success: false,
            message: `Server Error: ${err.message || err}`
        });
    }
}



export const updateMRN = async (req: Request, res: Response) => {
    const { id, tenantId, branchId } = req.user!;
    const { mrnId } = req.params;
    const {
        storeId, purchaseType, partyType,
        partyCode, partyName, dcNo, dcDate, invoiceNo, invoiceDate, parts
    } = req.body; 

    if (!id || !tenantId || !branchId) {
        return res.status(401).json({ success: false, message: 'Not authorized login again' });
    }

    try {
        // --- 1. Validations ---
        const isTenantExists = await prisma.tenant.findUnique({ where: { id: Number(tenantId) } });
        if (!isTenantExists) return res.status(403).json({ success: false, message: 'Tenant not exists' });

        const isBranchExists = await prisma.branch.findFirst({
            where: { id: Number(branchId), tenantId: Number(tenantId) }
        });
        if (!isBranchExists) return res.status(403).json({ success: false, message: 'Branch not exists in tenant' });

        const isStoreExists = await prisma.storeMaster.findFirst({
            where: { id: Number(storeId), tenantId: Number(tenantId), branchId: Number(branchId) }
        });
        if (!isStoreExists) return res.status(403).json({ success: false, message: 'Store not exists in branch' });

        const ismrnExists = await prisma.mRNMaster.findUnique({
            where: { id: Number(mrnId), tenantId: Number(tenantId), branchId: Number(branchId) },
            include: { mrnDetails: true }
        });
        if (!ismrnExists) return res.status(403).json({ success: false, message: 'MRN not exists' });

        // Status Lock Rule
        if (ismrnExists.status === 'FULLY_RECEIVED' && ismrnExists.mrnType !== 'AGAINST_DC') {
            return res.status(403).json({
                success: false,
                message: 'User will not be allowed to change the details if the status is Fully Received'
            });
        }

        if (!Array.isArray(parts)) {
            return res.status(400).json({ success: false, message: 'Parts must be in array format' });
        }

        // --- 2. Validate Parts ---
        const partsIds = parts.map((d: any) => Number(d.branchPartId));
        const existingBranchParts = await prisma.branchPartMaster.findMany({
            where: { id: { in: partsIds }, tenantId: Number(tenantId), branchId: Number(branchId) }
        });
        if (existingBranchParts.length !== partsIds.length) {
            return res.status(403).json({ success: false, message: 'One or more Parts do not exist in this branch' });
        }

        // --- 3. Calculate Totals ---
        let newTotalTaxable = new Prisma.Decimal(0);
        let newTotalDiscount = new Prisma.Decimal(0);
        let newTotalInvoiceVal = new Prisma.Decimal(0);
        let newTotalMRNVal = new Prisma.Decimal(0);

        const mappedParts = parts.map((d: any) => {
            const rate = new Prisma.Decimal(d.rate || 0);
            const qty = new Prisma.Decimal(d.invQuantity || d.invoiceQty || 0);
            const discount = new Prisma.Decimal(d.discount || 0);
            const tax = new Prisma.Decimal(d.taxAmount || d.tax || 0);
            const taxRate = new Prisma.Decimal(d.taxRate || 0);

            const lineTotal = qty.mul(rate).minus(discount).plus(tax);

            newTotalTaxable = newTotalTaxable.plus(qty.mul(rate));
            newTotalDiscount = newTotalDiscount.plus(discount);
            newTotalInvoiceVal = newTotalInvoiceVal.plus(qty.mul(rate).minus(discount));
            newTotalMRNVal = newTotalMRNVal.plus(lineTotal);

            return {
                id: d.id ? Number(d.id) : null, // Important for upsert
                tenantId: Number(tenantId),
                branchId: Number(branchId),
                mrnId: Number(mrnId),
                branchPartId: Number(d.branchPartId),
                binId: Number(d.binId),
                invoiceQty: qty,
                receivedQty: new Prisma.Decimal(d.receivedQty || 0),
                shortQty: new Prisma.Decimal(d.shortQty || 0),
                damageQty: new Prisma.Decimal(d.damageQty || 0),
                excessQty: new Prisma.Decimal(d.excessQty || 0),
                rate: rate,
                discount: discount,
                taxRate: taxRate,
                taxAmount: tax,
                lineTotal: lineTotal,
                reason: d.reason || null,
                isReceived: Number(d.receivedQty || 0) > 0
            };
        });

        // --- 4. Execute Transaction ---
        const result = await prisma.$transaction(async (tx) => {
            
            // A. Update Master Header
            const mrnUpdate = await tx.mRNMaster.update({
                where: { id: Number(mrnId) },
                data: {
                    purchaseType: purchaseType || null,
                    partyCode: partyCode || null,
                    partyName: partyName || null,
                    partyType: partyType || null,
                    dcNo: dcNo || null,
                    dcDate: dcDate ? new Date(dcDate) : null, // FIX 2
                    invoiceNo: invoiceNo || null,
                    invoiceDate: invoiceDate ? new Date(invoiceDate) : null, // FIX 2
                    totalDiscountValue: newTotalDiscount,
                    totalInvoiceValue: newTotalInvoiceVal,
                    totalMRNValue: newTotalMRNVal,
                    totalTaxableValue: newTotalTaxable,
                    updatedById: Number(id)
                }
            });
            for (const part of mappedParts) {
                if (part.id) {
                    // Update existing row
                    const { id: detailId, ...updateData } = part;
                    await tx.mRNDetail.update({
                        where: { id: detailId as number },
                        data: updateData
                    });
                } else {
                    // Create new row
                    const { id, ...createData } = part;
                    await tx.mRNDetail.create({
                        data: createData
                    });
                }
            }

            return mrnUpdate;
        });

        // FIX 3: Return Response
        return res.status(200).json({
            success: true,
            message: `MRN ${result.mrnNo} updated successfully`
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: `Server error: ${error.message || error}`
        });
    }
};

