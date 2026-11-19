import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";

export const createBinsInStore = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { binCode, binDescription, storeId } = req.body;

    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!binCode || !storeId) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isStoreExists = await prisma.storeMaster.findUnique({
            where: {
                id: Number(storeId)
            }
        })
        if (!isStoreExists) {
            return res.status(403).json({
                success: true,
                message: `Store not exists`
            })
        }
        const data = await prisma.binMaster.create({
            data: {
                binCode: binCode,
                binDescription: binDescription,
                storeId : Number(storeId)
            },
            include : {
                store : {
                    select : {
                        code : true
                    }
                }
            }
        })
        return res.status(201).json({
            success: true,
            message: `Bin ${data.binCode} is created in store ${data.store.code} successfully.`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}


export const updateBinDetails = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { binId } = req.params;
    const { binCode, binDescription, storeId } = req.body;

    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!binCode || !storeId) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    if (!binId) {
        return res.status(403).json({
            success: false,
            message: 'Bin Id is required'
        })
    }
    try {
        const isBinExists = await prisma.binMaster.findUnique({
            where: {
                id: Number(binId)
            }
        })
        if (!isBinExists) {
            return res.status(403).json({
                success: true,
                message: `Bin not exists`
            })
        }
        const isStoreExists = await prisma.storeMaster.findUnique({
            where: {
                id: Number(storeId)
            }
        })
        if (!isStoreExists) {
            return res.status(403).json({
                success: true,
                message: `Store not exists`
            })
        }
        const data = await prisma.binMaster.update({
            data: {
                binCode: binCode,
                binDescription: binDescription,
                storeId: Number(storeId)
            },
            where: {
                id: Number(binId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `Bin ${data.binCode} successfully updated.`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const getListOfBinsAccordingToStore = async (req: Request, res: Response) => {
    const { id, tenantId, branchId } = req.user!
    if (!id || !tenantId || !branchId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        const listOfStoresInBranch = await prisma.storeMaster.findMany({
            where: {
                tenantId: Number(tenantId),
                branchId: Number(branchId),
                IsActive: true
            }
        })
        const StoreId = listOfStoresInBranch.map((s : any)=> s.id)
        const listOfBinsInStore = await prisma.binMaster.findMany({
            where : {
                storeId : {
                    in : StoreId
                } 
            }
        })
        return res.status(200).json({
            success: true,
            data: listOfBinsInStore,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const getBinDetails = async (req: Request, res: Response) => {
    const { id, tenantId, branchId } = req.user!
    const { binId } = req.params
    if (!id || !tenantId || !branchId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!binId) {
        return res.status(401).json({
            success: false,
            message: 'Bin Id is required'
        })
    }
    try {
        const isBinExists = await prisma.binMaster.findUnique({
            where: {
                id: Number(binId)
            }
        })
        if (!isBinExists) {
            return res.status(403).json({
                success: false,
                message: 'Bin not exists'
            })
        }
        return res.status(200).json({
            success: true,
            data: isBinExists
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}


export const deactivateStore = async (req: Request, res: Response) => {
    const { id, tenantId, branchId } = req.user!
    const { binId } = req.params
    if (!id || !tenantId || !branchId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!binId) {
        return res.status(401).json({
            success: false,
            message: 'Bin Id is required'
        })
    }
    try {
        const isBinExists = await prisma.binMaster.findUnique({
            where: {
                id: Number(binId)
            }
        })
        if (!isBinExists) {
            return res.status(403).json({
                success: false,
                message: 'Bin not exists'
            })
        }
        const data = await prisma.binMaster.update({
            where: {
                id: Number(binId)
            },
            data: {
                IsActive: false
            }
        })
        return res.status(200).json({
            success: true,
            message: `Bin ${data.binCode} is deactivated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const activateStore = async (req: Request, res: Response) => {
    const { id, tenantId, branchId } = req.user!
    const { binId } = req.params
    if (!id || !tenantId || !branchId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!binId) {
        return res.status(401).json({
            success: false,
            message: 'Bin Id is required'
        })
    }
    try {
        const isBinExists = await prisma.binMaster.findUnique({
            where: {
                id: Number(binId)
            }
        })
        if (!isBinExists) {
            return res.status(403).json({
                success: false,
                message: 'Bin not exists'
            })
        }
        const data = await prisma.binMaster.update({
            where: {
                id: Number(binId)
            },
            data: {
                IsActive: true
            }
        })
        return res.status(200).json({
            success: true,
            message: `Bin ${data.binCode} is activated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}