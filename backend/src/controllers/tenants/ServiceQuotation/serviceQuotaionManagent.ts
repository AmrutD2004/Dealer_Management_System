import { Request, Response } from "express";
import { prisma } from "../../../prisma/lib/prisma";
import GetFiscalYear from "get-fiscal-year";
import dayjs from "dayjs";
import { Prisma } from "../../../generated/prisma/client";
import { count } from "console";

export const createQuotation = async (req: Request, res: Response) => {
    const { id, tenantId, branchId } = req.user!
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    const { action, status, vehicleId, customerId, currentReading, serviceCategoryId, serviceTypeId, repairOrderTypeId, insurancePartyName, parts, labours, customerVoices, originalQuotationId } = req.body;

    if (!action || !status || !vehicleId || !customerId || !currentReading || !serviceTypeId || !repairOrderTypeId || parts === null || labours === null || customerVoices === null || !serviceCategoryId) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isVehicleExists = await prisma.vehicle.findUnique({
            where: {
                id: Number(vehicleId)
            }
        })
        if (!isVehicleExists) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            })
        }
        const isCustomerExists = await prisma.customer.findUnique({
            where: {
                id: Number(customerId)
            }
        })
        if (!isCustomerExists) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            })
        }
        const isServiceCategoryExists = await prisma.serviceCategoryMaster.findUnique({
            where: {
                id: Number(serviceCategoryId)
            }
        })
        if (!isServiceCategoryExists) {
            return res.status(404).json({
                success: false,
                message: 'Service Category not found'
            })
        }
        const isServiceTypeExists = await prisma.serviceTypeMaster.findUnique({
            where: {
                id: Number(serviceTypeId)
            }
        })
        if (!isServiceTypeExists) {
            return res.status(404).json({
                success: false,
                message: 'Service type not found'
            })
        }
        const isRepairOrderTypeExists = await prisma.repairOrderTypeMaster.findUnique({
            where: {
                id: Number(repairOrderTypeId)
            }
        })
        if (!isRepairOrderTypeExists) {
            return res.status(404).json({
                success: false,
                message: 'Repair order type not found'
            })
        }
        const isBranchExists = await prisma.branch.findUnique({
            where: {
                id: Number(branchId)
            },
            select: {
                branchCode: true
            }
        })
        const getFinacialYear = () => {
            const get = new GetFiscalYear();
            const Years = get.getFiscalYear("IN", "current");
            const current = dayjs(Years.fiscalYearStart.split('T')[0]).format('YY');
            const next = dayjs(Years.fiscalYearEnd.split('T')[0]).format('YY');
            return { current, next };
        };

        const { current, next } = getFinacialYear();
        const fiscalYear = `${current}${next}`;
        const prefix = `SQO${isBranchExists?.branchCode}${fiscalYear}`;
        const lastServiceQuotation = await prisma.serviceQuotationMaster.findFirst({
            where: {
                tenantId: Number(tenantId),
                branchId: Number(branchId),
                quotationNo: { startsWith: prefix },
            },
            orderBy: { quotationNo: 'desc' },
            select: { quotationNo: true },
        });

        let lastSeq = 0
        if (lastServiceQuotation) {
            const sequencePart =
                lastServiceQuotation.quotationNo.slice(prefix.length);

            lastSeq = Number(sequencePart);

            if (!/^\d{9}$/.test(sequencePart) || !Number.isSafeInteger(lastSeq)) {
                throw new Error("Invalid existing quotation number sequence");
            }
        }

        const nextSeq = (lastSeq + 1).toString().padStart(9, '0');
        const quotationNo = `${prefix}${nextSeq}`;
        const result = await prisma.$transaction(async (tx) => {
            const quotation = await tx.serviceQuotationMaster.create({
                data: {
                    action: action,
                    tenantId: Number(tenantId),
                    branchId: Number(branchId),
                    quotationNo: quotationNo,
                    originalQuotationId: action === "SUPPLEMENT" ? Number(originalQuotationId) : null,
                    status: status,
                    vehicleId: Number(vehicleId),
                    customerId: Number(customerId),
                    currentReading: new Prisma.Decimal(currentReading),
                    serviceCategoryId: Number(serviceCategoryId),
                    serviceTypeId: Number(serviceTypeId),
                    repairOrderTypeId: Number(repairOrderTypeId),
                    insurancePartyName: insurancePartyName || null,

                    partsBasicAmount: new Prisma.Decimal(0),
                    partsDiscountAmount: new Prisma.Decimal(0),
                    partsTaxAmount: new Prisma.Decimal(0),
                    partsTotalAmount: new Prisma.Decimal(0),

                    labourBasicAmount: new Prisma.Decimal(0),
                    labourDiscountAmount: new Prisma.Decimal(0),
                    labourTaxAmount: new Prisma.Decimal(0),
                    labourTotalAmount: new Prisma.Decimal(0),

                    grandTotal: new Prisma.Decimal(0),
                    createdBy: Number(id),

                }
            })
            const zero = new Prisma.Decimal(0);
            if (!Array.isArray(parts)) {
                throw new Error('Parts must be in array')
            }
            const partIds = parts.map((p) => Number(p.partId))
            if (new Set(partIds).size !== partIds.length) {
                throw new Error('Duplicate parts are not allowed in the same request')
            }
            const masterParts = await tx.partMaster.findMany({
                where: {
                    tenantId: Number(tenantId),
                    id: {
                        in: partIds
                    },
                    status: 'ACTIVE'
                },
                include: {
                    hsn: true
                }
            })
            if (masterParts.length !== partIds.length) {
                throw new Error('One or more parts do not exist, are inactive, or belong to another tenant')
            }

            //Creating masterPartMap
            const masterPartMap = new Map(              //Map example [1, {id : 1, partNo : 'BR-001', partDesc : "Any"}]
                masterParts.map((p) => ([p.id, p]))       //[2, {id : 2, partNo : 'BR-002', partDesc : "Any"}]
            )
            const partQuotation = parts.map((requestedParts) => {
                const part = masterPartMap.get(Number(requestedParts.partId))
                if (!part) {
                    throw new Error('Parts not found')
                }

                const quantity = Number(requestedParts.quantity)
                const rate = new Prisma.Decimal(part.sellingPrice)
                const taxRate = new Prisma.Decimal(part.taxRate)

                if (!Number.isInteger(quantity) || quantity <= 0) {
                    throw new Error('Quantity must be positive')
                }
                const basicAmount = rate.mul(quantity)

                const discountType = requestedParts.discountType

                const discountRate = new Prisma.Decimal(
                    requestedParts.discountRate ?? 0
                )
                if (discountRate.isNegative() || !discountRate.isFinite()) {
                    throw new Error((`Invalid discount for part ${part?.partNo}`))
                }
                let discountAmount: Prisma.Decimal;
                if (discountType === 'PERCENTAGE') {
                    if (discountRate.greaterThan(100)) {
                        throw new Error(`Discount rate cannot exceed 100 for part ${part?.partNo}`)
                    }
                    discountAmount = basicAmount.mul(discountRate).div(100).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP)
                } else if (discountType === 'AMOUNT') {
                    discountAmount = discountRate;
                } else {
                    throw new Error(`Invalid discount type for part ${part?.partNo}`);

                }
                if (discountAmount.greaterThan(basicAmount)) {
                    throw new Error(`Discount cannot exceed basic amount for part ${part.partNo}`);
                }
                const taxableAmount = basicAmount.minus(discountAmount)
                const taxAmount = taxableAmount.mul(taxRate).div(100).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP)
                const totalAmount = taxableAmount.add(taxAmount)
                return {
                    tenantId: Number(tenantId),
                    serviceQuotationId: Number(quotation.id),
                    partId: Number(part.id),

                    partNo: part.partNo,
                    partDescription: part.partDescription,
                    quantity,
                    rate,
                    basicAmount,
                    discountType,
                    discountRate,
                    discountAmount,

                    hsnCode: part.hsn.hsnCode,
                    taxRate,
                    taxableAmount,
                    taxAmount,
                    totalAmount
                }
            });
            await tx.serviceQuotationPart.createMany({
                data: partQuotation,
            })
            const partsTotal = partQuotation.reduce((acc, part) => ({
                basic: acc.basic.add(part.basicAmount),
                discount: acc.discount.add(part.discountAmount),
                tax: acc.tax.add(part.taxAmount),
                total: acc.total.add(part.totalAmount)
            }), {
                basic: zero,
                discount: zero,
                tax: zero,
                total: zero
            })

            await tx.serviceQuotationMaster.update({
                data: {
                    partsBasicAmount: partsTotal.basic,
                    partsDiscountAmount: partsTotal.discount,
                    partsTaxAmount: partsTotal.tax,
                    partsTotalAmount: partsTotal.total
                },
                where: {
                    id: Number(quotation.id)
                }
            })

            if (!Array.isArray(labours)) {
                throw new Error('Labours must be in array')
            }

            const labourIds = labours.map((l) => Number(l.labourId))
            if (new Set(labourIds).size !== labourIds.length) {
                throw new Error('Duplicate labours are not allowed in the same request')
            }
            const masterLabours = await tx.labourMaster.findMany({
                where: {
                    tenantId: Number(tenantId),
                    id: {
                        in: labourIds
                    },
                    isActive: true
                },
                include: {
                    hsn: true
                }
            })
            if (masterLabours.length !== labourIds.length) {
                throw new Error('One or more labours do not exist, are inactive, or belong to another tenant')
            }
            const masterLabourMap = new Map(
                masterLabours.map((l) => ([l.id, l]))
            )
            const labourQuotation = labours.map((requestedLabours) => {
                const labour = masterLabourMap.get(Number(requestedLabours.labourId))
                if (!labour) {
                    throw new Error('Labours not found')
                }
                const rate = new Prisma.Decimal(labour.rate)
                const hours = labour.standardHours
                const basicAmount = hours.mul(rate)

                const discountType = requestedLabours.discountType
                const discountRate = new Prisma.Decimal(requestedLabours.discountRate ?? 0)

                if (discountRate.isNegative() || !discountRate.isFinite()) {
                    throw new Error((`Invalid discount for labour ${labour?.labourCode}`))
                }
                let discountAmount: Prisma.Decimal;
                if (discountType === 'PERCENTAGE') {
                    if (discountRate.greaterThan(100)) {
                        throw new Error(`Discount rate cannot exceed 100 for labour ${labour?.labourCode}`)
                    }
                    discountAmount = basicAmount.mul(discountRate).div(100).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP)
                } else if (discountType === 'AMOUNT') {
                    discountAmount = discountRate;
                } else {
                    throw new Error(`Invalid discount type for labour ${labour?.labourCode}`);

                }
                if (discountAmount.greaterThan(basicAmount)) {
                    throw new Error(`Discount cannot exceed basic amount for labour ${labour.labourCode}`);
                }
                const taxableAmount = basicAmount.minus(discountAmount)
                if (labour.hsn?.taxRate == null) {
                    throw new Error(`HSN tax rate missing for labour ${labour.labourCode}`);
                }

                const taxRate = new Prisma.Decimal(labour.hsn.taxRate);
                const taxAmount = taxableAmount.mul(taxRate).div(100).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP)
                const totalAmount = taxableAmount.add(taxAmount)
                return {
                    tenantId: Number(tenantId),
                    serviceQuotationId: Number(quotation.id),
                    labourId: Number(labour.id),

                    labourCode: labour.labourCode,
                    labourDescription: labour.labourDescription,
                    labourName: labour.labourName,
                    rate,
                    basicAmount,
                    discountType,
                    discountRate,
                    discountAmount,

                    taxRate,
                    taxableAmount,
                    taxAmount,
                    totalAmount
                }
            })
            await tx.serviceQuotationLabour.createMany({
                data: labourQuotation
            })

            const labourTotal = labourQuotation.reduce((acc, labour) => ({
                basic: acc.basic.add(labour.basicAmount),
                total: acc.total.add(labour.totalAmount),
                tax: acc.tax.add(labour.taxAmount),
                discount: acc.discount.add(labour.discountAmount)
            }), {
                basic: zero,
                total: zero,
                tax: zero,
                discount: zero
            })

            const grandTotal = partsTotal.total.add(labourTotal.total)
            await tx.serviceQuotationMaster.update({
                data: {
                    labourBasicAmount: labourTotal.basic,
                    labourTaxAmount: labourTotal.tax,
                    labourDiscountAmount: labourTotal.discount,
                    labourTotalAmount: labourTotal.total,
                    grandTotal: grandTotal
                },
                where: {
                    id: Number(quotation.id)
                }
            })

            if (!Array.isArray(customerVoices)) {
                throw new Error('Customer Voice must be in array')
            }
            const validSources = [
                "CUSTOMER",
                "SERVICE_SUPERVISOR",
                "FORM_PREVIOUS_JOB_CARD",
                "TEST_DRIVE",
            ];

            const quotationVoiceRows = customerVoices.map((voice: any) => {
                if (
                    typeof voice.customerVoice !== "string" ||
                    !voice.customerVoice.trim()
                ) {
                    throw new Error("Customer voice cannot be empty");
                }

                if (!validSources.includes(voice.source)) {
                    throw new Error(
                        `Invalid customer voice source: ${voice.source}`
                    );
                }

                return {
                    tenantId: Number(tenantId),
                    serviceQuotationId: quotation.id,
                    customerVoice: voice.customerVoice.trim(),
                    source: voice.source,
                };
            });

            if (quotationVoiceRows.length > 0) {
                await tx.serviceQuotationCustomerVoice.createMany({
                    data: quotationVoiceRows,
                });
            }

            return tx.serviceQuotationMaster.findUnique({
                where: { id: quotation.id },
                include: {
                    serviceQuotationParts: true,
                    serviceQuotationCustomerVoices: true,
                    serviceQuotationLabours: true
                },
            });
        });


        return res.status(201).json({
            success: true,
            message: "Service quotation created successfully",
            data: result,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }
}


export const getListOfServiceQuotation = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { skip, take } = req.query;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        let listOfServiceQuotation
        const totalServiceQuotation = await prisma.serviceQuotationMaster.count({
            where: {
                tenantId: Number(tenantId)
            }
        })
        if (skip || take) {
            listOfServiceQuotation = await prisma.serviceQuotationMaster.findMany({
                skip: Number(skip),
                take: Number(take),
                where: {
                    tenantId: Number(tenantId)
                },
                include: {
                    customer: {
                        include: {
                            authorizedByUser: true
                        }
                    },
                    vehicle: true,
                    serviceCategory: true,
                    serviceType: true,
                    repairOrderType: true,
                    serviceQuotationLabours: true,
                    serviceQuotationParts: true,
                    serviceQuotationCustomerVoices: true,
                    branch: true,
                    createdByEmployee: true
                }
            })
        } else {
            listOfServiceQuotation = await prisma.serviceQuotationMaster.findMany({
                where: {
                    tenantId: Number(tenantId)
                },
                include: {
                    customer: {
                        include: {
                            authorizedByUser: true
                        }
                    },
                    vehicle: true,
                    serviceCategory: true,
                    serviceType: true,
                    repairOrderType: true,
                    serviceQuotationLabours: true,
                    serviceQuotationParts: true,
                    serviceQuotationCustomerVoices: true,
                    branch: true,
                    createdByEmployee: true
                }
            })
            return res.status(200).json({
                success : true,
                data : listOfServiceQuotation,
                count : totalServiceQuotation
            })
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }
}


export const getServiceQuotationDetails = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { serviceQuotationId } = req.params;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!serviceQuotationId) {
        return res.status(404).json({
            success: false,
            message: 'Service Quotation id required'
        })
    }
    try {
        const isServiceQuotationExists = await prisma.serviceQuotationMaster.findUnique({
            where: {
                id: Number(serviceQuotationId)
            }
        })
        if (!isServiceQuotationExists) {
            return res.status(404).json({
                success: false,
                message: 'Service Quotation not found'
            })
        }
        return res.status(200).json({
            success: false,
            data: isServiceQuotationExists
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }
}

export const updateQuotation = async (req: Request, res: Response) => {
    const { id, tenantId, branchId } = req.user!
    const { serviceQuotationId } = req.params;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    const { action, status, vehicleId, customerId, currentReading, serviceCategoryId, serviceTypeId, repairOrderTypeId, insurancePartyName, parts, labours, customerVoices, originalQuotationId } = req.body;

    if (!action || !status || !vehicleId || !customerId || !currentReading || !serviceTypeId || !repairOrderTypeId || parts === null || labours === null || customerVoices === null || !serviceCategoryId) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isVehicleExists = await prisma.vehicle.findUnique({
            where: {
                id: Number(vehicleId)
            }
        })
        if (!isVehicleExists) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            })
        }
        const isCustomerExists = await prisma.customer.findUnique({
            where: {
                id: Number(customerId)
            }
        })
        if (!isCustomerExists) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            })
        }
        const isServiceCategoryExists = await prisma.serviceCategoryMaster.findUnique({
            where: {
                id: Number(serviceCategoryId)
            }
        })
        if (!isServiceCategoryExists) {
            return res.status(404).json({
                success: false,
                message: 'Service Category not found'
            })
        }
        const isServiceTypeExists = await prisma.serviceTypeMaster.findUnique({
            where: {
                id: Number(serviceTypeId)
            }
        })
        if (!isServiceTypeExists) {
            return res.status(404).json({
                success: false,
                message: 'Service type not found'
            })
        }
        const isRepairOrderTypeExists = await prisma.repairOrderTypeMaster.findUnique({
            where: {
                id: Number(repairOrderTypeId)
            }
        })
        if (!isRepairOrderTypeExists) {
            return res.status(404).json({
                success: false,
                message: 'Repair order type not found'
            })
        }
        const isBranchExists = await prisma.branch.findUnique({
            where: {
                id: Number(branchId)
            },
            select: {
                branchCode: true
            }
        })
        if (!isBranchExists) {
            return res.status(404).json({
                success: false,
                message: 'Branch not found'
            })
        }
        const isServiceQuotationExists = await prisma.serviceQuotationMaster.findUnique({
            where: {
                id: Number(serviceQuotationId),
                tenantId: Number(tenantId),
                branchId: Number(branchId)
            }
        })
        if (!isServiceQuotationExists) {
            return res.status(404).json({
                success: false,
                message: 'Service Quotation not found'
            })
        }
        const result = await prisma.$transaction(async (tx) => {
            const quotation = await tx.serviceQuotationMaster.update({
                data: {
                    action: action,
                    tenantId: Number(tenantId),
                    branchId: Number(branchId),
                    originalQuotationId: action === "SUPPLEMENT" ? Number(originalQuotationId) : null,
                    status: status,
                    vehicleId: Number(vehicleId),
                    customerId: Number(customerId),
                    currentReading: new Prisma.Decimal(currentReading),
                    serviceCategoryId: Number(serviceCategoryId),
                    serviceTypeId: Number(serviceTypeId),
                    repairOrderTypeId: Number(repairOrderTypeId),
                    insurancePartyName: insurancePartyName || null,

                    partsBasicAmount: new Prisma.Decimal(0),
                    partsDiscountAmount: new Prisma.Decimal(0),
                    partsTaxAmount: new Prisma.Decimal(0),
                    partsTotalAmount: new Prisma.Decimal(0),

                    labourBasicAmount: new Prisma.Decimal(0),
                    labourDiscountAmount: new Prisma.Decimal(0),
                    labourTaxAmount: new Prisma.Decimal(0),
                    labourTotalAmount: new Prisma.Decimal(0),

                    grandTotal: new Prisma.Decimal(0),

                },
                where: {
                    id: Number(serviceQuotationId)
                }
            })
            await tx.serviceQuotationPart.deleteMany({
                where: {
                    serviceQuotationId: Number(serviceQuotationId),
                    tenantId: Number(tenantId)
                }
            })
            await tx.serviceQuotationLabour.deleteMany({
                where: {
                    serviceQuotationId: Number(serviceQuotationId),
                    tenantId: Number(tenantId)
                }
            })
            await tx.serviceQuotationCustomerVoice.deleteMany({
                where: {
                    serviceQuotationId: Number(serviceQuotationId),
                    tenantId: Number(tenantId)
                }
            })
            const zero = new Prisma.Decimal(0);
            if (!Array.isArray(parts)) {
                throw new Error('Parts must be in array')
            }
            const partIds = parts.map((p) => Number(p.partId))
            if (new Set(partIds).size !== partIds.length) {
                throw new Error('Duplicate parts are not allowed in the same request')
            }
            const masterParts = await tx.partMaster.findMany({
                where: {
                    tenantId: Number(tenantId),
                    id: {
                        in: partIds
                    },
                    status: 'ACTIVE'
                },
                include: {
                    hsn: true
                }
            })
            if (masterParts.length !== partIds.length) {
                throw new Error('One or more parts do not exist, are inactive, or belong to another tenant')
            }

            //Creating masterPartMap
            const masterPartMap = new Map(              //Map example [1, {id : 1, partNo : 'BR-001', partDesc : "Any"}]
                masterParts.map((p) => ([p.id, p]))       //[2, {id : 2, partNo : 'BR-002', partDesc : "Any"}]
            )
            const partQuotation = parts.map((requestedParts) => {
                const part = masterPartMap.get(Number(requestedParts.partId))
                if (!part) {
                    throw new Error('Parts not found')
                }

                const quantity = Number(requestedParts.quantity)
                const rate = new Prisma.Decimal(part.sellingPrice)
                const taxRate = new Prisma.Decimal(part.taxRate)

                if (!Number.isInteger(quantity) || quantity <= 0) {
                    throw new Error('Quantity must be positive')
                }
                const basicAmount = rate.mul(quantity)

                const discountType = requestedParts.discountType

                const discountRate = new Prisma.Decimal(
                    requestedParts.discountRate ?? 0
                )
                if (discountRate.isNegative() || !discountRate.isFinite()) {
                    throw new Error((`Invalid discount for part ${part?.partNo}`))
                }
                let discountAmount: Prisma.Decimal;
                if (discountType === 'PERCENTAGE') {
                    if (discountRate.greaterThan(100)) {
                        throw new Error(`Discount rate cannot exceed 100 for part ${part?.partNo}`)
                    }
                    discountAmount = basicAmount.mul(discountRate).div(100).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP)
                } else if (discountType === 'AMOUNT') {
                    discountAmount = discountRate;
                } else {
                    throw new Error(`Invalid discount type for part ${part?.partNo}`);

                }
                if (discountAmount.greaterThan(basicAmount)) {
                    throw new Error(`Discount cannot exceed basic amount for part ${part.partNo}`);
                }
                const taxableAmount = basicAmount.minus(discountAmount)
                const taxAmount = taxableAmount.mul(taxRate).div(100).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP)
                const totalAmount = taxableAmount.add(taxAmount)
                return {
                    tenantId: Number(tenantId),
                    serviceQuotationId: Number(quotation.id),
                    partId: Number(part.id),

                    partNo: part.partNo,
                    partDescription: part.partDescription,
                    quantity,
                    rate,
                    basicAmount,
                    discountType,
                    discountRate,
                    discountAmount,

                    hsnCode: part.hsn.hsnCode,
                    taxRate,
                    taxableAmount,
                    taxAmount,
                    totalAmount
                }
            });
            await tx.serviceQuotationPart.createMany({
                data: partQuotation,
            })
            const partsTotal = partQuotation.reduce((acc, part) => ({
                basic: acc.basic.add(part.basicAmount),
                discount: acc.discount.add(part.discountAmount),
                tax: acc.tax.add(part.taxAmount),
                total: acc.total.add(part.totalAmount)
            }), {
                basic: zero,
                discount: zero,
                tax: zero,
                total: zero
            })

            await tx.serviceQuotationMaster.update({
                data: {
                    partsBasicAmount: partsTotal.basic,
                    partsDiscountAmount: partsTotal.discount,
                    partsTaxAmount: partsTotal.tax,
                    partsTotalAmount: partsTotal.total
                },
                where: {
                    id: Number(quotation.id)
                }
            })

            if (!Array.isArray(labours)) {
                throw new Error('Labours must be in array')
            }

            const labourIds = labours.map((l) => Number(l.labourId))
            if (new Set(labourIds).size !== labourIds.length) {
                throw new Error('Duplicate labours are not allowed in the same request')
            }
            const masterLabours = await tx.labourMaster.findMany({
                where: {
                    tenantId: Number(tenantId),
                    id: {
                        in: labourIds
                    },
                    isActive: true
                },
                include: {
                    hsn: true
                }
            })
            if (masterLabours.length !== labourIds.length) {
                throw new Error('One or more labours do not exist, are inactive, or belong to another tenant')
            }
            const masterLabourMap = new Map(
                masterLabours.map((l) => ([l.id, l]))
            )
            const labourQuotation = labours.map((requestedLabours) => {
                const labour = masterLabourMap.get(Number(requestedLabours.labourId))
                if (!labour) {
                    throw new Error('Labours not found')
                }
                const rate = new Prisma.Decimal(labour.rate)
                const hours = labour.standardHours
                const basicAmount = hours.mul(rate)

                const discountType = requestedLabours.discountType
                const discountRate = new Prisma.Decimal(requestedLabours.discountRate ?? 0)

                if (discountRate.isNegative() || !discountRate.isFinite()) {
                    throw new Error((`Invalid discount for labour ${labour?.labourCode}`))
                }
                let discountAmount: Prisma.Decimal;
                if (discountType === 'PERCENTAGE') {
                    if (discountRate.greaterThan(100)) {
                        throw new Error(`Discount rate cannot exceed 100 for labour ${labour?.labourCode}`)
                    }
                    discountAmount = basicAmount.mul(discountRate).div(100).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP)
                } else if (discountType === 'AMOUNT') {
                    discountAmount = discountRate;
                } else {
                    throw new Error(`Invalid discount type for labour ${labour?.labourCode}`);

                }
                if (discountAmount.greaterThan(basicAmount)) {
                    throw new Error(`Discount cannot exceed basic amount for labour ${labour.labourCode}`);
                }
                const taxableAmount = basicAmount.minus(discountAmount)
                if (labour.hsn?.taxRate == null) {
                    throw new Error(`HSN tax rate missing for labour ${labour.labourCode}`);
                }

                const taxRate = new Prisma.Decimal(labour.hsn.taxRate);
                const taxAmount = taxableAmount.mul(taxRate).div(100).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP)
                const totalAmount = taxableAmount.add(taxAmount)
                return {
                    tenantId: Number(tenantId),
                    serviceQuotationId: Number(quotation.id),
                    labourId: Number(labour.id),

                    labourCode: labour.labourCode,
                    labourDescription: labour.labourDescription,
                    labourName: labour.labourName,
                    rate,
                    basicAmount,
                    discountType,
                    discountRate,
                    discountAmount,

                    taxRate,
                    taxableAmount,
                    taxAmount,
                    totalAmount
                }
            })
            await tx.serviceQuotationLabour.createMany({
                data: labourQuotation
            })

            const labourTotal = labourQuotation.reduce((acc, labour) => ({
                basic: acc.basic.add(labour.basicAmount),
                total: acc.total.add(labour.totalAmount),
                tax: acc.tax.add(labour.taxAmount),
                discount: acc.discount.add(labour.discountAmount)
            }), {
                basic: zero,
                total: zero,
                tax: zero,
                discount: zero
            })

            const grandTotal = partsTotal.total.add(labourTotal.total)
            await tx.serviceQuotationMaster.update({
                data: {
                    labourBasicAmount: labourTotal.basic,
                    labourTaxAmount: labourTotal.tax,
                    labourDiscountAmount: labourTotal.discount,
                    labourTotalAmount: labourTotal.total,
                    grandTotal: grandTotal
                },
                where: {
                    id: Number(quotation.id)
                }
            })

            if (!Array.isArray(customerVoices)) {
                throw new Error('Customer Voice must be in array')
            }
            const validSources = [
                "CUSTOMER",
                "SERVICE_SUPERVISOR",
                "FORM_PREVIOUS_JOB_CARD",
                "TEST_DRIVE",
            ];

            const quotationVoiceRows = customerVoices.map((voice: any) => {
                if (
                    typeof voice.customerVoice !== "string" ||
                    !voice.customerVoice.trim()
                ) {
                    throw new Error("Customer voice cannot be empty");
                }

                if (!validSources.includes(voice.source)) {
                    throw new Error(
                        `Invalid customer voice source: ${voice.source}`
                    );
                }

                return {
                    tenantId: Number(tenantId),
                    serviceQuotationId: quotation.id,
                    customerVoice: voice.customerVoice.trim(),
                    source: voice.source,
                };
            });

            if (quotationVoiceRows.length > 0) {
                await tx.serviceQuotationCustomerVoice.createMany({
                    data: quotationVoiceRows,
                });
            }

            return tx.serviceQuotationMaster.findUnique({
                where: { id: quotation.id },
                include: {
                    serviceQuotationParts: true,
                    serviceQuotationCustomerVoices: true,
                    serviceQuotationLabours: true
                },
            });
        });


        return res.status(201).json({
            success: true,
            message: "Service quotation updated successfully",
            data: result,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }
}



