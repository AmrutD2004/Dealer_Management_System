import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";

export const addModel = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { brandId, modelCode, modelName, bodyType } = req.body;
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
    if (!modelCode || !modelName || !brandId || !bodyType) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isModelExits = await prisma.vehicleModelMaster.findUnique({
            where: {
                brandId_modelCode: {
                    brandId: Number(brandId),
                    modelCode: modelCode
                }
            },
            include: {
                brand: true
            }

        })
        if (isModelExits) {
            return res.status(500).json({
                success: false,
                message: `Model already exists with name ${modelName} of brand ${isModelExits.brand.brandName}`
            })
        }
        const data = await prisma.vehicleModelMaster.create({
            data: {
                modelCode: modelCode,
                modelName: modelName,
                brandId: Number(brandId),
                bodyType: bodyType
            },
            include: {
                brand: true
            }
        })
        return res.status(201).json({
            success: true,
            message: `Model ${data.modelName} is created of brand ${data.brand.brandName}`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const updateModel = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { modelId } = req.params;
    const { brandId, modelCode, modelName, bodyType } = req.body;
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
    if (!modelId) {
        return res.status(403).json({
            success: false,
            message: 'Model id is required'
        })
    }
    if (!modelCode || !modelName || !brandId || !bodyType) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isModelExits = await prisma.vehicleModelMaster.findUnique({
            where: {
                brandId_modelCode: {
                    brandId: Number(brandId),
                    modelCode: modelCode
                }
            },
            include: {
                brand: true
            }

        })
        if (!isModelExits) {
            return res.status(500).json({
                success: false,
                message: `Model not exists with name ${modelName}`
            })
        }
        const data = await prisma.vehicleModelMaster.update({
            data: {
                brandId  : Number(brandId),
                modelCode: modelCode,
                modelName: modelName,
                bodyType : bodyType
            },
            where: {
                id: Number(modelId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `Model ${data.modelName} is updated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const getModelDetails = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { modelId } = req.params;
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
    if (!modelId) {
        return res.status(403).json({
            success: false,
            message: 'Model id is required'
        })
    }
    try {
        const isModelExits = await prisma.vehicleModelMaster.findUnique({
            where: {
                id : Number(modelId)
            },
            include: {
                brand: true
            }

        })
        if (!isModelExits) {
            return res.status(500).json({
                success: false,
                message: `Model not exists`
            })
        }
        return res.status(201).json({
            success: true,
            data: isModelExits
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const getListOfModels = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { skip, take } = req.query;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login'
        })
    }
    try {
        const totalModels = await prisma.vehicleModelMaster.count()
        let listOfModels
        if (skip || take) {
            listOfModels = await prisma.vehicleModelMaster.findMany({
                skip: Number(skip),
                take: Number(take)
            })
        }
        listOfModels = await prisma.vehicleModelMaster.findMany()
        return res.status(201).json({
            success: true,
            data: listOfModels,
            count: totalModels
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}


export const deactivateModel = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { modelId } = req.params;
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
    if (!modelId) {
        return res.status(403).json({
            success: false,
            message: 'Model id is required'
        })
    }
    try {
        const isModelExits = await prisma.vehicleModelMaster.findUnique({
            where: { id: Number(modelId) },
            include : {
                brand : true
            }
        })
        if (!isModelExits) {
            return res.status(500).json({
                success: false,
                message: `Model not exists`
            })
        }
        const data = await prisma.vehicleModelMaster.update({
            data: {
                isActive: false
            },
            where: {
                id: Number(modelId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `Model ${data.modelName} is deactivated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const activateModel = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { modelId } = req.params;
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
    if (!modelId) {
        return res.status(403).json({
            success: false,
            message: 'Model id is required'
        })
    }
    try {
        const isModelExits = await prisma.vehicleModelMaster.findUnique({
            where: { id: Number(modelId) },
            include : {
                brand : true
            }
        })
        if (!isModelExits) {
            return res.status(500).json({
                success: false,
                message: `Model not exists`
            })
        }
        const data = await prisma.vehicleModelMaster.update({
            data: {
                isActive: true
            },
            where: {
                id: Number(modelId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `Model ${data.modelName} is deactivated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}