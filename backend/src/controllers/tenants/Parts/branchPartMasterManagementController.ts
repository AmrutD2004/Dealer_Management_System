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

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}
