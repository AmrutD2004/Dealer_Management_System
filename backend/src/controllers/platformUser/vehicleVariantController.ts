import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";

export const addVariants = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { modelId, variantCode, variantName, fuelType, transmisstionType, productionFrom, productionTo } = req.body;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login'
        })
    }
    if (userType !== 'PLATFORM_USER') {
        return res.status(401).json({
            success: false,
            message: 'Platform User required'
        })
    }
    if (!modelId || !variantCode || !variantName || !fuelType || !transmisstionType) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isModelExists = await prisma.vehicleModelMaster.findUnique({
            where: {
                id: Number(modelId)
            }
        })
        if (!isModelExists) {
            return res.status(404).json({
                success: false,
                message: 'Model not found'
            })
        }
        const isVariantExits = await prisma.vehicleVariantMaster.findUnique({
            where: {
                modelId_fuelType_variantCode: {
                    modelId: Number(modelId),
                    fuelType: fuelType,
                    variantCode: variantCode
                }
            },
            include: {
                model: {
                    select: {
                        modelName: true
                    }
                }
            }
        })
        if (isVariantExits) {
            return res.status(500).json({
                success: false,
                message: `Variant ${variantCode} with fuel type ${fuelType} already exists for this model.`
            })
        }
        const data = await prisma.vehicleVariantMaster.create({
            data: {
                variantCode: variantCode,
                variantName: variantName,
                modelId: Number(modelId),
                fuelType: fuelType,
                transmissionType: transmisstionType,
                productionFrom: new Date(productionFrom) || null,
                productionTo: productionTo || null
            },
            include: {
                model: {
                    select: {
                        modelName: true
                    }
                }
            }
        })
        return res.status(201).json({
            success: true,
            message: `Variant ${data.variantName} is created of model ${data.model.modelName}`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const updateVariant = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { variantId } = req.params;
    const { modelId, variantCode, variantName, fuelType, transmisstionType, productionFrom, productionTo } = req.body;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login'
        })
    }
    if (userType !== 'PLATFORM_USER') {
        return res.status(401).json({
            success: false,
            message: 'Platform User required'
        })
    }
    if (!variantId) {
        return res.status(403).json({
            success: false,
            message: 'Variant id is required'
        })
    }
    if (!modelId || !variantCode || !variantName || !fuelType || !transmisstionType) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isModelExists = await prisma.vehicleModelMaster.findUnique({
            where: {
                id: Number(modelId)
            }
        })
        if (!isModelExists) {
            return res.status(404).json({
                success: false,
                message: 'Model not found'
            })
        }
        const isVariantExits = await prisma.vehicleVariantMaster.findUnique({
            where: {
                id: Number(id)
            }
        })
        if (!isVariantExits) {
            return res.status(500).json({
                success: false,
                message: `Variant not exists.`
            })
        }
        const data = await prisma.vehicleVariantMaster.update({
            data: {
                variantCode: variantCode,
                variantName: variantName,
                modelId: Number(modelId),
                fuelType: fuelType,
                transmissionType: transmisstionType,
                productionFrom: new Date(productionFrom) || null,
                productionTo: productionTo || null
            },
            where: {
                id: Number(variantId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `Variant ${data.variantName} is updated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const getVariantDetails = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { variantId } = req.params;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login'
        })
    }
    if (userType !== 'PLATFORM_USER') {
        return res.status(401).json({
            success: false,
            message: 'Platform User required'
        })
    }
    if (!variantId) {
        return res.status(403).json({
            success: false,
            message: 'Variant id is required'
        })
    }
    try {
        const isVariantExits = await prisma.vehicleVariantMaster.findUnique({
            where: {
                id: Number(id)
            }
        })
        if (!isVariantExits) {
            return res.status(500).json({
                success: false,
                message: `Variant not exists.`
            })
        }
        const data = await prisma.vehicleVariantMaster.findUnique({
            where: {
                id: Number(variantId)
            }
        })
        return res.status(200).json({
            success: true,
            data: data
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}


export const getListOfVariants = async (req: Request, res: Response) => {
    const { id } = req.user!;
    const { skip, take } = req.query;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login'
        })
    }
    try {
        const totalVariants = await prisma.vehicleVariantMaster.count()
        let listOfVariants
        if (skip || take) {
            listOfVariants = await prisma.vehicleVariantMaster.findMany({
                skip: Number(skip),
                take: Number(take),
                include: {
                    model: {
                        select: {
                            modelName: true,
                            modelCode: true,
                            brand: true
                        }
                    },
                }
            })
        }
        listOfVariants = await prisma.vehicleVariantMaster.findMany({

        })
        return res.status(201).json({
            success: true,
            data: listOfVariants,
            count: totalVariants
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}


export const deactivateVariant = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { variantId } = req.params;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login'
        })
    }
    if (userType !== 'PLATFORM_USER') {
        return res.status(401).json({
            success: false,
            message: 'Platform User required'
        })
    }
    if (!variantId) {
        return res.status(403).json({
            success: false,
            message: 'variant id is required'
        })
    }
    try {
        const isVariantExits = await prisma.vehicleVariantMaster.findUnique({
            where: { id: Number(variantId) },
            include: {
                model: {
                    select: {
                        modelName: true,
                        modelCode: true,
                        brand: true
                    }
                },
            }
        })
        if (!isVariantExits) {
            return res.status(500).json({
                success: false,
                message: `Variant not exists`
            })
        }
        const data = await prisma.vehicleVariantMaster.update({
            data: {
                isActive: false
            },
            where: {
                id: Number(variantId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `Variant ${data.variantName} is deactivated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const activateVariant = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { variantId } = req.params;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login'
        })
    }
    if (userType !== 'PLATFORM_USER') {
        return res.status(401).json({
            success: false,
            message: 'Platform User required'
        })
    }
    if (!variantId) {
        return res.status(403).json({
            success: false,
            message: 'variant id is required'
        })
    }
    try {
        const isVariantExits = await prisma.vehicleVariantMaster.findUnique({
            where: { id: Number(variantId) },
            include: {
                model: {
                    select: {
                        modelName: true,
                        modelCode: true,
                        brand: true
                    }
                },
            }
        })
        if (!isVariantExits) {
            return res.status(500).json({
                success: false,
                message: `Variant not exists`
            })
        }
        const data = await prisma.vehicleVariantMaster.update({
            data: {
                isActive: true
            },
            where: {
                id: Number(variantId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `Variant ${data.variantName} is deactivated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}