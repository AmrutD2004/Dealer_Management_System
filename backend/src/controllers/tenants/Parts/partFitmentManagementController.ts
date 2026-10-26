import { Request, Response } from "express";
import { prisma } from "../../../prisma/lib/prisma";

export const addPartFitment = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { brandId, isOem, modelId, partId, position, quantity, variantId, validFrom, validTo } = req.body;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!brandId || !modelId || !partId || !variantId) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    const isBrandExists = await prisma.brandMaster.findUnique({
        where: {
            id: Number(brandId)
        }
    })
    const isModelExists = await prisma.vehicleModelMaster.findUnique({
        where: {
            id: Number(modelId)
        }
    })
    const isVariantExists = await prisma.vehicleVariantMaster.findUnique({
        where: {
            id: Number(variantId)
        }
    })
    const isPartExists = await prisma.partMaster.findUnique({
        where: {
            id: Number(partId)
        }
    })
    if (!isBrandExists) {
        return res.status(404).json({
            success: false,
            message: "Brand not exists"
        })
    }
    if (!isModelExists) {
        return res.status(404).json({
            success: false,
            message: "Model not exists"
        })
    }
    if (!isVariantExists) {
        return res.status(404).json({
            success: false,
            message: "Variant not exists"
        })
    }
    if (!isPartExists) {
        return res.status(404).json({
            success: false,
            message: "Part not exists"
        })
    }
    try {
        const data = await prisma.partFitment.create({
            data: {
                tenantId: Number(tenantId),
                brandId: Number(brandId),
                modelId: Number(modelId),
                variantId: Number(variantId),
                isOem: isOem ?? false,
                partId: Number(partId),
                position: position ? position : null,
                quantity: quantity ? quantity : null,
                validFrom: validFrom ? new Date(validFrom) : undefined,
                validTo: validTo ? new Date(validTo) : null
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
        return res.status(201).json({
            success: true,
            message: `Part having no ${data.part.partNo} fitment is created with ${data.model.modelName} of ${data.variant.variantName} ${data.brand.brandName} brand`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}

export const updatePartFitment = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { fitmentId } = req.params;
    const { brandId, isOem, modelId, partId, position, quantity, variantId, validFrom, validTo } = req.body;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!brandId || !modelId || !partId || !variantId) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    if (!fitmentId) {
        return res.status(403).json({
            success: false,
            message: 'Fitment Id is required'
        })
    }
    const isBrandExists = await prisma.brandMaster.findUnique({
        where: {
            id: Number(brandId)
        }
    })
    const isModelExists = await prisma.vehicleModelMaster.findUnique({
        where: {
            id: Number(modelId)
        }
    })
    const isVariantExists = await prisma.vehicleVariantMaster.findUnique({
        where: {
            id: Number(variantId)
        }
    })
    const isPartExists = await prisma.partMaster.findUnique({
        where: {
            id: Number(partId)
        }
    })
    if (!isBrandExists) {
        return res.status(404).json({
            success: false,
            message: "Brand not exists"
        })
    }
    if (!isModelExists) {
        return res.status(404).json({
            success: false,
            message: "Model not exists"
        })
    }
    if (!isVariantExists) {
        return res.status(404).json({
            success: false,
            message: "Variant not exists"
        })
    }
    if (!isPartExists) {
        return res.status(404).json({
            success: false,
            message: "Part not exists"
        })
    }
    try {
        const data = await prisma.partFitment.update({
            data: {
                tenantId: Number(tenantId),
                brandId: Number(brandId),
                modelId: Number(modelId),
                variantId: Number(variantId),
                isOem: isOem ?? false,
                partId: Number(partId),
                position: position ? position : null,
                quantity: quantity ? quantity : null,
                validFrom: validFrom ? new Date(validFrom) : undefined,
                validTo: validTo ? new Date(validTo) : null
            },
            where: {
                id: Number(fitmentId)
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
        return res.status(201).json({
            success: true,
            message: `Part having no ${data.part.partNo} fitment is updated with ${data.model.modelName} of ${data.variant.variantName} ${data.brand.brandName} brand`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}

export const getListOfPartFitment = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { skip, take } = req.query;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        const totalParts = await prisma.partFitment.count({
            where: {
                tenantId: Number(tenantId)
            }
        })
        let listOfParts
        if (skip || take) {
            listOfParts = await prisma.partFitment.findMany({
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
                    brand: true,
                    part: true,
                    model: true,
                    variant: true
                }
            })
        }
        listOfParts = await prisma.partFitment.findMany({
            where: {
                tenantId: Number(tenantId)
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true,
                    }
                },
                brand: true,
                part: true,
                model: true,
                variant: true
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

export const getPartFitmentDetails = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { fitmentId } = req.params;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!fitmentId) {
        return res.status(403).json({
            success: false,
            message: 'Fitment Id is required'
        })
    }
    try {
        const isPartFitmentExists = await prisma.partFitment.findUnique({
            where: {
                id: Number(fitmentId)
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                },
                brand: true,
                part: true,
                model: true,
                variant: true
            }
        })
        if (!isPartFitmentExists) {
            return res.status(403).json({
                success: false,
                message: `part fitment not exists.`
            })
        }
        return res.status(201).json({
            success: true,
            data: isPartFitmentExists
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}

