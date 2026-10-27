import { Request, Response } from "express";
import { prisma } from "../../../prisma/lib/prisma";

export const addPartMaster = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { partNo, partDescription, partCategoryId, isFastMoving, hsnId, reorderLevel, sellingPrice, status, supersededById, taxRate, unitOfMeasure, validFrom, validTo } = req.body;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!hsnId || !partDescription || !partNo || !sellingPrice || !taxRate || !unitOfMeasure) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
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
        const data = await prisma.partMaster.create({
            data: {
                tenantId: Number(tenantId),
                partNo: partNo,
                partDescription: partDescription,
                hsnId: Number(hsnId),
                partCategoryId: partCategoryId
                    ? Number(partCategoryId)
                    : null,
                sellingPrice: Number(sellingPrice),
                taxRate: Number(taxRate),
                unitOfMeasure: unitOfMeasure,
                isFastMoving: isFastMoving ?? false,
                reorderLevel:
                    reorderLevel !== undefined && reorderLevel !== null
                        ? Number(reorderLevel)
                        : null,
                validFrom: new Date(validFrom) || null,
                validTo: new Date(validTo) || null
            },
        });
        return res.status(201).json({
            success: true,
            message: `${data.partNo} part is created`
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
    const { partNo, partDescription, partCategoryId, isFastMoving, hsnId, reorderLevel, sellingPrice, status, supersededById, taxRate, unitOfMeasure, validFrom, validTo } = req.body;
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
    if (!hsnId || !partDescription || !partNo || !sellingPrice || !taxRate || !unitOfMeasure) {
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
        const data = await prisma.partMaster.update({
            data: {
                tenantId: Number(tenantId),
                partNo: partNo,
                partDescription: partDescription,
                hsnId: Number(hsnId),
                partCategoryId: partCategoryId
                    ? Number(partCategoryId)
                    : null,
                sellingPrice: Number(sellingPrice),
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
                    category: true
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
                category: true
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
