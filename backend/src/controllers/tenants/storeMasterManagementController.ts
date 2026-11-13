import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";

export const createStores = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { code, description, isBlocked, isMainStore, branchId } = req.body;

    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!code || !branchId || !description || typeof isBlocked !== 'boolean' || 
    typeof isMainStore !== 'boolean') {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isStoreExists = await prisma.storeMaster.findUnique({
            where: {
                code_tenantId_branchId: {
                    code: code,
                    tenantId: Number(tenantId),
                    branchId: Number(branchId)
                }
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                },
                branch: {
                    select: {
                        branchName: true
                    }
                }
            }
        })
        const isBranchExists = await prisma.branch.findUnique({
            where: {
                id: Number(branchId)
            }
        })
        const isTenantExists = await prisma.tenant.findUnique({
            where: {
                id: Number(tenantId)
            }
        })
        if (!isBranchExists) {
            return res.status(403).json({
                success: true,
                message: `Branch not exists`
            })
        }
        if (!isTenantExists) {
            return res.status(403).json({
                success: true,
                message: `Tenant not exists`
            })
        }
        if (isStoreExists) {
            return res.status(403).json({
                success: true,
                message: `Store is already exists in ${isStoreExists.branch.branchName} of tenant ${isStoreExists.tenant.tenantName}`
            })
        }
        const data = await prisma.storeMaster.create({
            data: {
                code: code,
                description: description,
                IsActive: true,
                IsBlocked: isBlocked,
                IsMainStore: isMainStore,
                tenantId: Number(tenantId),
                branchId: Number(branchId)
            }
        })
        return res.status(201).json({
            success: true,
            message: 'Store successfully created.'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}


export const updateStoreDetails = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { storeId } = req.params;
    const { code, description, isBlocked, isMainStore, branchId } = req.body;

    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!code || !branchId || !description || !isBlocked || !isMainStore) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    if (!storeId) {
        return res.status(403).json({
            success: false,
            message: 'Store Id is required'
        })
    }
    try {
        const isStoreExists = await prisma.storeMaster.findUnique({
            where: {
                id: Number(storeId)
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                },
                branch: {
                    select: {
                        branchName: true
                    }
                }
            }
        })
        const isBranchExists = await prisma.branch.findUnique({
            where: {
                id: Number(branchId)
            }
        })
        const isTenantExists = await prisma.tenant.findUnique({
            where: {
                id: Number(tenantId)
            }
        })
        if (!isBranchExists) {
            return res.status(403).json({
                success: true,
                message: `Branch not exists`
            })
        }
        if (!isTenantExists) {
            return res.status(403).json({
                success: true,
                message: `Tenant not exists`
            })
        }
        if (!isStoreExists) {
            return res.status(403).json({
                success: true,
                message: `Store not exists`
            })
        }
        const data = await prisma.storeMaster.update({
            data: {
                code: code,
                description: description,
                IsActive: true,
                IsBlocked: isBlocked,
                IsMainStore: isMainStore,
                tenantId: Number(tenantId),
                branchId: Number(branchId)
            },
            where: {
                id: Number(storeId)
            }
        })
        return res.status(201).json({
            success: true,
            message: 'Store successfully updated.'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const getListOfStores = async (req: Request, res: Response) => {
    const { id, tenantId, branchId } = req.user!
    if (!id || !tenantId || !branchId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        const totalStores = await prisma.storeMaster.count({
            where: {
                tenantId: Number(tenantId),
                branchId: Number(branchId),
            }
        })
        const listOfStoresInBranch = await prisma.storeMaster.findMany({
            where: {
                tenantId: Number(tenantId),
                branchId: Number(branchId),
                IsActive: true
            }
        })
        return res.status(200).json({
            success: true,
            data: listOfStoresInBranch,
            count: totalStores
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const getStoreDetails = async (req: Request, res: Response) => {
    const { id, tenantId, branchId } = req.user!
    const { storeId } = req.params
    if (!id || !tenantId || !branchId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!storeId) {
        return res.status(401).json({
            success: false,
            message: 'Store Id is required'
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
                success: false,
                message: 'Store not exists'
            })
        }
        return res.status(200).json({
            success: true,
            data: isStoreExists
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
    const { storeId } = req.params
    if (!id || !tenantId || !branchId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!storeId) {
        return res.status(401).json({
            success: false,
            message: 'Store Id is required'
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
                success: false,
                message: 'Store not exists'
            })
        }
        const data = await prisma.storeMaster.update({
            where: {
                id: Number(storeId)
            },
            data: {
                IsActive: false
            }
        })
        return res.status(200).json({
            success: true,
            message: `Store ${data.code} is deactivated`
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
    const { storeId } = req.params
    if (!id || !tenantId || !branchId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!storeId) {
        return res.status(401).json({
            success: false,
            message: 'Store Id is required'
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
                success: false,
                message: 'Store not exists'
            })
        }
        const data = await prisma.storeMaster.update({
            where: {
                id: Number(storeId)
            },
            data: {
                IsActive: true
            }
        })
        return res.status(200).json({
            success: true,
            message: `Store ${data.code} is activated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}