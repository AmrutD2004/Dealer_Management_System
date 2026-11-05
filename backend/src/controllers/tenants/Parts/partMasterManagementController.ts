import { Request, Response } from "express";
import { prisma } from "../../../prisma/lib/prisma";
import { UploadedFile } from "express-fileupload";
import * as XLSX from 'xlsx';

export const addPartMaster = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { partNo, partDescription, partCategoryId, isFastMoving, hsnId, reorderLevel, sellingPrice, status, supersededById, taxRate, unitOfMeasure, validFrom, validTo, landingPrice,

        //Fitment body
        brandId, isOem, modelId, position, quantity, variantId, fitmentValidFrom, fitmentValidTo } = req.body;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!hsnId || !partDescription || !partNo || !sellingPrice || !taxRate || !unitOfMeasure || !brandId || !modelId || !variantId || !landingPrice || !quantity) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isHSNExists = await prisma.hSNMaster.findUnique({
            where: {
                id: Number(hsnId)
            }
        })
        if (!isHSNExists) {
            return res.status(404).json({
                success: false,
                message: 'HSN not exists'
            })
        }
        const isPartCategoryExists = await prisma.partCategoryMaster.findUnique({
            where: {
                id: Number(partCategoryId)
            }
        })
        if (!isPartCategoryExists) {
            return res.status(404).json({
                success: false,
                message: 'Part category not exists'
            })
        }

        const isPartExists = await prisma.partMaster.findUnique({
            where: {
                tenantId_partNo: {
                    tenantId: Number(tenantId),
                    partNo: partNo
                }
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                },
            }
        })
        if (isPartExists) {
            return res.status(403).json({
                success: false,
                message: `Part already exists with code ${partNo} in ${isPartExists.tenant.tenantName}`
            })
        }
        const result = await prisma.$transaction(async (tx) => {
            const part = await tx.partMaster.create({
                data: {
                    tenantId: Number(tenantId),
                    partNo: partNo,
                    partDescription: partDescription,
                    hsnId: Number(hsnId),
                    partCategoryId: partCategoryId
                        ? Number(partCategoryId)
                        : null,
                    sellingPrice: parseFloat(sellingPrice).toFixed(2),
                    landingPrice: parseFloat(landingPrice).toFixed(2),
                    taxRate: Number(taxRate),
                    unitOfMeasure: unitOfMeasure,
                    isFastMoving: isFastMoving ?? false,
                    reorderLevel:
                        reorderLevel !== undefined && reorderLevel !== null
                            ? Number(reorderLevel)
                            : null,
                    validFrom: new Date(validFrom) || null,
                    validTo: validTo ? new Date(validTo) : null
                },
            });
            const fitment = await tx.partFitment.create({
                data: {
                    tenantId: Number(tenantId),
                    brandId: Number(brandId),
                    modelId: Number(modelId),
                    variantId: Number(variantId),
                    isOem: isOem ?? false,
                    partId: Number(part.id),
                    position: position ? position : null,
                    quantity: quantity ? quantity : null,
                    validFrom: fitmentValidFrom ? new Date(fitmentValidFrom) : undefined,
                    validTo: fitmentValidTo ? new Date(fitmentValidTo) : null
                },
                include: {
                    brand: {
                        select: {
                            brandName: true
                        }
                    },
                    model: {
                        select: {
                            modelName: true
                        }
                    },
                    variant: {
                        select: {
                            variantName: true
                        }
                    },
                    part: {
                        select: {
                            partNo: true
                        }
                    }
                }
            });
            return { part, fitment }
        })


        return res.status(201).json({
            success: true,
            message: `${result.part.partNo} part is created and fitment is created with ${result.fitment.model.modelName} of ${result.fitment.variant.variantName} ${result.fitment.brand.brandName} brand`
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}

export const updatePartMaster = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { partId } = req.params;
    const { partNo, partDescription, partCategoryId, isFastMoving, hsnId, reorderLevel, sellingPrice, status, supersededById, taxRate, unitOfMeasure, validFrom, validTo, landingPrice } = req.body;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!partId) {
        return res.status(400).json({
            success: false,
            message: 'Part Id is required'
        })
    }
    if (!hsnId || !partDescription || !partNo || !sellingPrice || !taxRate || !unitOfMeasure || !landingPrice) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    if (validFrom && Number.isNaN(new Date(validFrom).getTime())) {
        return res.status(400).json({
            success: false,
            message: "Invalid validFrom date",
        });
    }

    if (validTo && Number.isNaN(new Date(validTo).getTime())) {
        return res.status(400).json({
            success: false,
            message: "Invalid validTo date",
        });
    }
    try {
        const isPartExists = await prisma.partMaster.findUnique({
            where: {
                id: Number(partId)
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                }
            }
        })
        if (!isPartExists) {
            return res.status(403).json({
                success: false,
                message: `part not exists with code ${partNo}.`
            })
        }
        if (supersededById) {
            const supersedingPart = await prisma.partMaster.findUnique({
                where: { id: Number(supersededById) },
                include: { tenant: true }
            });
            if (!supersedingPart || supersedingPart.tenantId !== tenantId) {
                return res.status(404).json({ success: false, message: 'Superseding part not found' });
            }
        }

        const data = await prisma.partMaster.update({
            data: {
                tenantId: Number(tenantId),
                partNo: partNo,
                partDescription: partDescription,
                hsnId: Number(hsnId),
                partCategoryId: partCategoryId
                    ? Number(partCategoryId)
                    : null,
                sellingPrice: parseFloat(sellingPrice),
                landingPrice: parseFloat(landingPrice),
                supersededById: Number(supersededById) || null,
                taxRate: Number(taxRate),
                unitOfMeasure: unitOfMeasure,
                isFastMoving: isFastMoving ?? false,
                reorderLevel:
                    reorderLevel !== undefined && reorderLevel !== null
                        ? Number(reorderLevel)
                        : null,
                validFrom: validFrom ? new Date(validFrom) : undefined,
                validTo: validTo ? new Date(validTo) : null
            },
            where: {
                id: Number(partId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `${data.partNo} part is updated`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}

export const getListOfParts = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { skip, take } = req.query;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        const totalParts = await prisma.partMaster.count({
            where: {
                tenantId: Number(tenantId)
            }
        })
        let listOfParts
        if (skip || take) {
            listOfParts = await prisma.partMaster.findMany({
                skip: Number(skip),
                take: Number(take),
                where: {
                    tenantId: Number(tenantId)
                },
                include: {
                    tenant: {
                        select: {
                            tenantName: true,
                        }
                    },
                    hsn: true,
                    category: true,
                    fitments: true
                }
            })
        }
        listOfParts = await prisma.partMaster.findMany({
            where: {
                tenantId: Number(tenantId)
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true,
                    }
                },
                hsn: true,
                category: true
            }
        })

        return res.status(201).json({
            success: true,
            data: listOfParts,
            count: totalParts
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}

export const getPartDetails = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { partId } = req.params;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!partId) {
        return res.status(400).json({
            success: false,
            message: 'Part Id is required'
        })
    }
    try {
        const isPartExists = await prisma.partMaster.findUnique({
            where: {
                id: Number(partId)
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                },
                hsn: true,
                category: true,
                fitments: true
            }
        })
        if (!isPartExists) {
            return res.status(403).json({
                success: false,
                message: `part not exists.`
            })
        }
        return res.status(201).json({
            success: true,
            data: isPartExists
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}

export const deactivatePart = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { partId } = req.params;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!partId) {
        return res.status(400).json({
            success: false,
            message: 'Part Id is required'
        })
    }
    try {
        const isPartExists = await prisma.partMaster.findUnique({
            where: {
                id: Number(partId)
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                },
                hsn: true,
                category: true
            }
        })
        if (!isPartExists) {
            return res.status(403).json({
                success: false,
                message: `part not exists.`
            })
        }
        const data = await prisma.partMaster.update({
            data: {
                status: "INACTIVE"
            },
            where: {
                id: Number(partId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `${data.partNo} part is deactivated`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}

export const activatePart = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { partId } = req.params;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!partId) {
        return res.status(400).json({
            success: false,
            message: 'Part Id is required'
        })
    }
    try {
        const isPartExists = await prisma.partMaster.findUnique({
            where: {
                id: Number(partId)
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                },
                hsn: true,
                category: true
            }
        })
        if (!isPartExists) {
            return res.status(403).json({
                success: false,
                message: `part not exists.`
            })
        }
        const data = await prisma.partMaster.update({
            data: {
                status: "ACTIVE"
            },
            where: {
                id: Number(partId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `${data.partNo} part is activated`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}


export const addPartsAndFitmentUsingExcel = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const partFile = req.files?.file as UploadedFile | null
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        const readedFile = XLSX.read(partFile?.data, { type: 'buffer' })
        const sheetName = readedFile.SheetNames[0]
        const sheet = readedFile.Sheets[sheetName]
        const sheetData = XLSX.utils.sheet_to_json(sheet)

        //Extracting unique brands Names
        const brandNames = [...new Set(
            sheetData.map((b: any) => b['Brands'].trim())
        )]
        if (!brandNames) {
            return res.json({
                message: 'Brands not found in excel'
            })
        }
        //Extracting unique models Names
        const modelNames = [...new Set(
            sheetData.map((m: any) => m['Models'].trim())
        )]

        if (!modelNames) {
            return res.json({
                message: 'Models not found in excel'
            })
        }
        //Extracting unique part Names
        const partCategories = [...new Set(
            sheetData.map((c: any) => c['Part_Categories'].trim())
        )]
        if (!partCategories) {
            return res.json({
                message: 'Part Categories not found in excel'
            })
        }
        //Extracting unique HSN Code
        const hsnCodes = [...new Set(
            sheetData.map((c: any) => String(c['HSN']))
        )]

        //Extracting unique HSN Code
        const varints = [...new Set(
            sheetData.map((c: any) => c['Variants'])
        )]
        const brandIds = await prisma.brandMaster.findMany({
            where: {
                brandName: {
                    in: brandNames,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                brandName: true
            }
        })
        const modelIds = await prisma.vehicleModelMaster.findMany({
            where: {
                modelName: {
                    in: modelNames,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                modelName: true
            }
        })
        const varintsIds = await prisma.vehicleVariantMaster.findMany({
            where: {
                variantName: {
                    in: varints,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                variantName: true
            }
        })
        const categoryIds = await prisma.partCategoryMaster.findMany({
            where: {
                tenantId: Number(tenantId),
                name: {
                    in: partCategories,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                name: true
            }
        })
        const hsnIds = await prisma.hSNMaster.findMany({
            where: {
                hsnCode: {
                    in: hsnCodes,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                hsnCode: true
            }
        })

        //Lookups
        const brandMap = new Map(
            brandIds.map(b => [b.brandName.trim().toLowerCase(), b.id])
        );

        const modelMap = new Map(
            modelIds.map(m => [m.modelName.trim().toLowerCase(), m.id])
        );

        const variantMap = new Map(
            varintsIds.map(v => [v.variantName.trim().toLowerCase(), v.id])
        );

        const categoryMap = new Map(
            categoryIds.map(c => [c.name.trim().toLowerCase(), c.id])
        );

        const hsnMap = new Map(
            hsnIds.map(h => [String(h.hsnCode).trim(), h.id])
        );

        const result = await prisma.$transaction(async (tx: any) => {

            const importedData = []
            for (const part of sheetData as any[]) {
                // Get individual IDs from lookup Maps
                const hsnId = hsnMap.get(String(part.HSN).trim());

                const categoryId = categoryMap.get(
                    String(part.Part_Categories).trim().toLowerCase()
                );

                const brandId = brandMap.get(
                    String(part.Brands).trim().toLowerCase()
                );

                const modelId = modelMap.get(
                    String(part.Models).trim().toLowerCase()
                );

                const variantId = variantMap.get(
                    String(part.Variants).trim().toLowerCase()
                );
                const parts = await tx.partMaster.create({
                    data:
                    {
                        tenantId: Number(tenantId),
                        partNo: part.Part_No,
                        partDescription: part.Part_Description,
                        hsnId: hsnId,
                        partCategoryId: Number(categoryId) || null,
                        sellingPrice: parseFloat(part.Selling_Price).toFixed(2),
                        landingPrice: parseFloat(part.Landing_Price).toFixed(2),
                        taxRate: Number(part.Tax_Rate),
                        unitOfMeasure: part.Unit_Of_Measure,
                        isFastMoving: Boolean(part.Is_FastMoving) ?? false,
                        reorderLevel:
                            part.Reorder_Level !== undefined && part.Reorder_Level !== null
                                ? Number(part.Reorder_Level)
                                : null,
                        validFrom: new Date(part.Valid_From) || null,
                        validTo: part.Valid_To ? new Date(part.Valid_To) : null
                    }
                });
                const fitment = await tx.partFitment.createMany({
                    data: sheetData.map((fitment: any) => ({
                        tenantId: Number(tenantId),
                        brandId: brandId,
                        modelId: modelId,
                        variantId: variantId,
                        isOem: fitment.OEM === 'Yes' || fitment.OEM === 'YES' ? true : false,
                        partId: parts.id,
                        position: fitment.Position ? fitment.Position : null,
                        quantity: fitment.Quantity ? fitment.Quantity : null,
                        validFrom: fitment.Fitment_ValidFrom ? new Date(fitment.Fitment_ValidFrom) : undefined,
                        validTo: fitment.Fitment_ValidTo ? new Date(fitment.Fitment_ValidTo) : null
                    }))
                });
                importedData.push(
                    { parts, fitment }
                )
            }


            return importedData
        });
        return res.status(201).json({
            success: true,
            message: 'Parts and fitments imported successfully',
            importedCount: result.length,
            data: result
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}