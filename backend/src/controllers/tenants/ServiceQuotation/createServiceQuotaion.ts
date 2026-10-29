import { Request, Response } from "express";
import { prisma } from "../../../prisma/lib/prisma";
import GetFiscalYear from "get-fiscal-year";
import dayjs from "dayjs";
import { Prisma } from "../../../generated/prisma/client";

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
                throw new Error("Parts must be an array");
            }

            const partIds = parts.map((part: any) => Number(part.partId));

            if (
                parts.some(
                    (part: any) =>
                        !Number.isInteger(Number(part.partId)) ||
                        Number(part.partId) <= 0 ||
                        !Number.isInteger(Number(part.quantity)) ||
                        Number(part.quantity) <= 0
                )
            ) {
                throw new Error("Each part must have a valid partId and positive integer quantity");
            }

            if (new Set(partIds).size !== partIds.length) {
                throw new Error("Duplicate parts are not allowed in the same request");
            }

            const masterParts = await tx.partMaster.findMany({
                where: {
                    tenantId: Number(tenantId),
                    id: { in: partIds },
                    status: "ACTIVE",
                },
                include: {
                    hsn: true,
                },
            });

            if (masterParts.length !== partIds.length) {
                throw new Error(
                    "One or more parts do not exist, are inactive, or belong to another tenant"
                );
            }

            const masterPartMap = new Map(
                masterParts.map((part) => [part.id, part])
            );

            const quotationPartRows = parts.map((inputPart: any) => {
                const part = masterPartMap.get(Number(inputPart.partId))!;

                const quantity = Number(inputPart.quantity);
                const rate = new Prisma.Decimal(part.sellingPrice);
                const taxRate = new Prisma.Decimal(part.taxRate);

                const basicAmount = rate.mul(quantity);

                const discountType = inputPart.discountType;
                const discountRate = new Prisma.Decimal(
                    inputPart.discountRate ?? 0
                );

                if (
                    discountRate.isNegative() ||
                    !discountRate.isFinite()
                ) {
                    throw new Error(`Invalid discount for part ${part.partNo}`);
                }

                let discountAmount: Prisma.Decimal;

                if (discountType === "PERCENTAGE") {
                    if (discountRate.greaterThan(100)) {
                        throw new Error(
                            `Discount percentage cannot exceed 100 for part ${part.partNo}`
                        );
                    }

                    discountAmount = basicAmount
                        .mul(discountRate)
                        .div(100)
                        .toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
                } else if (discountType === "AMOUNT") {
                    // Assumes a fixed discount for the entire line.
                    discountAmount = discountRate;
                } else {
                    throw new Error(`Invalid discount type for part ${part.partNo}`);
                }

                if (discountAmount.greaterThan(basicAmount)) {
                    throw new Error(
                        `Discount cannot exceed the basic amount for part ${part.partNo}`
                    );
                }

                const taxableAmount = basicAmount.minus(discountAmount);

                const taxAmount = taxableAmount
                    .mul(taxRate)
                    .div(100)
                    .toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);

                const totalAmount = taxableAmount.plus(taxAmount);

                return {
                    tenantId: Number(tenantId),
                    serviceQuotationId: quotation.id,
                    partId: part.id,

                    partNo: part.partNo,
                    partDescription: part.partDescription,

                    quantity,
                    rate,
                    basicAmount,

                    discountType,
                    discountRate,
                    discountAmount,

                    // Update hsnCode to match your actual HSNMaster field name.
                    hsnCode: part.hsn.hsnCode,
                    taxRate,
                    taxableAmount,
                    taxAmount,
                    totalAmount,
                };
            });

            await tx.serviceQuotationPart.createMany({
                data: quotationPartRows,
            });

            const partsTotals = quotationPartRows.reduce(
                (totals, part) => ({
                    basic: totals.basic.plus(part.basicAmount),
                    discount: totals.discount.plus(part.discountAmount),
                    tax: totals.tax.plus(part.taxAmount),
                    total: totals.total.plus(part.totalAmount),
                }),
                {
                    basic: zero,
                    discount: zero,
                    tax: zero,
                    total: zero,
                }
            );

            await tx.serviceQuotationMaster.update({
                where: { id: quotation.id },
                data: {
                    partsBasicAmount: partsTotals.basic,
                    partsDiscountAmount: partsTotals.discount,
                    partsTaxAmount: partsTotals.tax,
                    partsTotalAmount: partsTotals.total,
                },
            });


            if (!Array.isArray(labours)) {
                throw new Error("Labours must be an array");
            }

            const labourIds = labours.map((item: any) => Number(item.labourId));

            if (
                labours.some(
                    (item: any) =>
                        !Number.isInteger(Number(item.labourId)) ||
                        Number(item.labourId) <= 0
                )
            ) {
                throw new Error("Each labour must have a valid labourId");
            }

            if (new Set(labourIds).size !== labourIds.length) {
                throw new Error("Duplicate labour entries are not allowed");
            }

            const masterLabours = await tx.labourMaster.findMany({
                where: {
                    tenantId: Number(tenantId),
                    id: { in: labourIds },
                    isActive: true,
                },
                include: {
                    hsn: true
                }
            });

            if (masterLabours.length !== labourIds.length) {
                throw new Error(
                    "One or more labour records do not exist, are inactive, or belong to another tenant"
                );
            }

            const labourMap = new Map(
                masterLabours.map((item) => [item.id, item])
            );

            const quotationLabourRows = await Promise.all(
                labours.map(async (input: any) => {
                    const labour = labourMap.get(Number(input.labourId))!;

                    // Uses standardHours because the current line model has no hours field.
                    const hours = new Prisma.Decimal(labour.standardHours);
                    const rate = new Prisma.Decimal(labour.rate);
                    const basicAmount = hours.mul(rate);

                    const discountType = input.discountType;
                    const discountRate = new Prisma.Decimal(
                        input.discountRate ?? 0
                    );

                    if (
                        !discountRate.isFinite() ||
                        discountRate.isNegative()
                    ) {
                        throw new Error(
                            `Invalid discount for labour ${labour.labourCode}`
                        );
                    }

                    let discountAmount: Prisma.Decimal;

                    if (discountType === "PERCENTAGE") {
                        if (discountRate.greaterThan(100)) {
                            throw new Error("Discount percentage cannot exceed 100");
                        }

                        discountAmount = basicAmount
                            .mul(discountRate)
                            .div(100)
                            .toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
                    } else if (discountType === "AMOUNT") {
                        // Fixed discount for the entire labour line.
                        discountAmount = discountRate;
                    } else {
                        throw new Error(
                            `Invalid discount type for labour ${labour.labourCode}`
                        );
                    }

                    if (discountAmount.greaterThan(basicAmount)) {
                        throw new Error(
                            `Discount cannot exceed basic amount for ${labour.labourCode}`
                        );
                    }

                    const taxableAmount = basicAmount.minus(discountAmount);

                    /*
                     * TODO: Obtain the applicable labour tax rate from your
                     * trusted backend tax configuration. Do not trust req.body.
                     *
                     * Replace this placeholder with your real lookup.
                     */
                    const taxRate = labour.hsn?.taxRate ? new Prisma.Decimal(labour.hsn?.taxRate) : 18

                    const taxAmount = taxableAmount
                        .mul(taxRate)
                        .div(100)
                        .toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);

                    const totalAmount = taxableAmount.plus(taxAmount);

                    return {
                        tenantId: Number(tenantId),
                        serviceQuotationId: quotation.id,
                        labourId: labour.id,
                        labourName: labour.labourName,
                        labourCode: labour.labourCode,
                        labourDescription: labour.labourDescription,
                        rate,
                        basicAmount,
                        discountType,
                        discountRate,
                        discountAmount,
                        taxRate,
                        taxableAmount,
                        taxAmount,
                        totalAmount,
                    };
                })
            );

            if (quotationLabourRows.length > 0) {
                await tx.serviceQuotationLabour.createMany({
                    data: quotationLabourRows,
                });
            }

            const labourTotals = quotationLabourRows.reduce(
                (totals, item) => ({
                    basic: totals.basic.plus(item.basicAmount),
                    discount: totals.discount.plus(item.discountAmount),
                    tax: totals.tax.plus(item.taxAmount),
                    total: totals.total.plus(item.totalAmount),
                }),
                {
                    basic: zero,
                    discount: zero,
                    tax: zero,
                    total: zero,
                }
            );

            await tx.serviceQuotationMaster.update({
                where: { id: quotation.id },
                data: {
                    labourBasicAmount: labourTotals.basic,
                    labourDiscountAmount: labourTotals.discount,
                    labourTaxAmount: labourTotals.tax,
                    labourTotalAmount: labourTotals.total,
                },
            });

            if (!Array.isArray(customerVoices)) {
                throw new Error("Customer voices must be an array");
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
        })
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