import { Request, Response } from "express";
import { prisma } from "../../../prisma/lib/prisma";
import { Prisma } from "../../../generated/prisma/client";

export const addBranchPartMaster = async (req: Request, res: Response) => {
    const { id, tenantId, branchId } = req.user!
    const { stores, partId, sellingPrice, minimumLevel, maximumLevel, safetyStock, reservationQty, latestLandedCost, mrp, reorderLevel } = req.body;
    if (!id || !tenantId || !branchId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!Array.isArray(stores)) {
        return res.status(400).json({
            success: false,
            message: 'Stores is not an array, it should be in array format'
        })
    }
    if (stores === null || !partId) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const storesIds = stores.map((s: any) => Number(s.storeId))
        const binsIds = stores.map((b: any) => Number(b.binId))
        const isStoreExists = await prisma.storeMaster.findMany({
            where: {
                id: {
                    in: storesIds
                }
            }
        })
        if (!isStoreExists) {
            return res.status(404).json({
                success: false,
                message: 'Store not exists'
            })
        }
        const isBinExists = await prisma.binMaster.findMany({
            where: {
                id: {
                    in: binsIds
                }
            }
        })
        if (!isBinExists) {
            return res.status(404).json({
                success: false,
                message: 'Bin not exists'
            })
        }
        const isPartExists = await prisma.partMaster.findUnique({
            where: {
                id: Number(partId)
            }
        })
        if (!isPartExists) {
            return res.status(403).json({
                success: false,
                message: `Part not exists`
            })
        }

        const data = await prisma.branchPartMaster.createMany({
            data: stores.map((store: any) => ({
                tenantId: Number(tenantId),
                branchId: Number(branchId),
                partId: Number(partId),
                storeId: Number(store.storeId),
                binId: Number(store.binId),
                stockInHand: new Prisma.Decimal(store.stockInHand),
                isDefaultBin: Boolean(store.isDefaultBin),
                isActive: Boolean(store.isActive),
                minimumLevel: minimumLevel ? Number(minimumLevel) : null,
                maximumLevel: maximumLevel ? Number(maximumLevel) : null,
                reorderLevel: reorderLevel ? Number(reorderLevel) : null,
                safetyStock: safetyStock ? Number(safetyStock) : null,
                reservationQty: reservationQty ? Number(reservationQty) : null,
                mrp: mrp ? new Prisma.Decimal(mrp) : null,
                sellingPrice: sellingPrice ? new Prisma.Decimal(sellingPrice) : null,
                latestLandedCost: latestLandedCost ? new Prisma.Decimal(latestLandedCost) : null,

            }))
        })
        return res.status(201).json({
            success: true,
            message: `Part added to a branch successfully`
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}

export const updateBranchPartMaster = async (req: Request, res: Response) => {
    const { id, tenantId, branchId } = req.user!
    const { branchPartId } = req.params;
    const { stores, partId, sellingPrice, minimumLevel, maximumLevel, safetyStock, reservationQty, latestLandedCost, mrp, reorderLevel } = req.body;
    if (!id || !tenantId || !branchId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!Array.isArray(stores)) {
        return res.status(400).json({
            success: false,
            message: 'Stores is not an array, it should be in array format'
        })
    }
    if (stores === null || !partId) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const storesIds = stores.map((s: any) => Number(s.storeId))
        const binsIds = stores.map((b: any) => Number(b.binId))
        const isStoreExists = await prisma.storeMaster.findMany({
            where: {
                id: {
                    in: storesIds
                }
            }
        })
        if (!isStoreExists) {
            return res.status(404).json({
                success: false,
                message: 'Store not exists'
            })
        }
        const isBinExists = await prisma.binMaster.findMany({
            where: {
                id: {
                    in: binsIds
                }
            }
        })
        if (!isBinExists) {
            return res.status(404).json({
                success: false,
                message: 'Bin not exists'
            })
        }
        const isPartExists = await prisma.partMaster.findUnique({
            where: {
                id: Number(partId)
            }
        })
        if (!isPartExists) {
            return res.status(403).json({
                success: false,
                message: `Part not exists`
            })
        }


        const data = await prisma.$transaction(
            stores.map((s: any) => {

                const storeData = {
                    partId: Number(partId),
                    storeId: Number(s.storeId),
                    binId: Number(s.binId),
                    stockInHand: new Prisma.Decimal(s.stockInHand),
                    isDefaultBin: Boolean(s.isDefaultBin),
                    isActive: Boolean(s.isActive),

                    minimumLevel: minimumLevel != null ? Number(minimumLevel) : null,
                    maximumLevel: maximumLevel != null ? Number(maximumLevel) : null,
                    reorderLevel: reorderLevel != null ? Number(reorderLevel) : null,
                    safetyStock: safetyStock != null ? Number(safetyStock) : null,
                    reservationQty: reservationQty != null ? Number(reservationQty) : null,

                    mrp: mrp != null ? new Prisma.Decimal(mrp) : null,
                    sellingPrice: sellingPrice != null ? new Prisma.Decimal(sellingPrice) : null,
                    latestLandedCost: latestLandedCost != null
                        ? new Prisma.Decimal(latestLandedCost)
                        : null
                };

                return prisma.branchPartMaster.upsert({
                    where: {
                        tenantId_branchId_partId_storeId_binId: {
                            tenantId: Number(tenantId),
                            branchId: Number(branchId),
                            partId: Number(partId),
                            storeId: Number(s.storeId),
                            binId: Number(s.binId)
                        }
                    },

                    create: {
                        ...storeData,
                        tenantId: Number(tenantId),
                        branchId: Number(branchId)
                    },

                    update: storeData
                });
            })
        );

        return res.status(201).json({
            success: true,
            message: `Part updated to a branch successfully`
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}


export const getListOfBranchPartMaster = async (req: Request, res: Response) => {
    const { id, tenantId, branchId } = req.user!
    const { skip, take } = req.query;
    if (!id || !tenantId || !branchId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        const totalParts = await prisma.branchPartMaster.count({
            where: {
                tenantId: Number(tenantId),
                branchId: Number(branchId)
            }
        })
        let listOfBranchPart
        if (skip || take) {
            listOfBranchPart = await prisma.branchPartMaster.findMany({
                skip: Number(skip),
                take: Number(take),
                include: {
                    part: true,
                    store: true,
                    bin: true
                },
                where: {
                    tenantId: Number(tenantId),
                    branchId: Number(branchId)
                }
            })
        }
        listOfBranchPart = await prisma.branchPartMaster.findMany({
            include: {
                part: true,
                store: true,
                bin: true
            },
            where: {
                tenantId: Number(tenantId),
                branchId: Number(branchId)
            }
        })
        return res.status(200).json({
            success: true,
            data: listOfBranchPart,
            count: totalParts
        })

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}

export const getDetailsOfBranchPartMaster = async (req: Request, res: Response) => {
    const { id, tenantId, branchId } = req.user!
    const { branchPartId } = req.params;
    if (!id || !tenantId || !branchId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        const isPartExists = await prisma.branchPartMaster.findUnique({
            where: {
                id: Number(branchPartId)
            }
        })
        if (!isPartExists) {
            return res.status(403).json({
                success: false,
                message: 'Part not exists in branch'
            })
        }
        return res.status(200).json({
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


export const searchedBranchParts = async(req : Request, res : Response)=>{
    const {id, tenantId, branchId} = req.user!
    const {part, store} = req.query
    if(!id || !tenantId || !branchId){
        return res.status(401).json({
            success : false,
            message : 'Not authorized login again'
        })
    }
    if(!part || !store){
        return res.status(400).json({
            success : false,
            message : 'Store id and part is required'
        })
    }
    try {
        const branchParts = await prisma.branchPartMaster.findMany({
            where : {
                storeId : Number(store),
                part : {
                    partNo : {
                        contains : String(part),
                        mode : 'insensitive'
                    },
                }
            },
            include : {
                part : {
                    include : {
                        hsn : true
                    }
                }
            }
        })
        if(!branchParts){
            return res.status(403).json({
                success : false,
                message : 'Branch not exists.'
            })
        }
        return res.status(200).json({
            success : true,
            data : branchParts
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : `Server error ${error}`
        })
    }
}