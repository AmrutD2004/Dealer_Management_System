import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";

export const createRepairOrder = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const {
        code,
        name,
        description
    } = req.body;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    if (
        !code ||
        !name
    ) {
        return res.status(404).json({
            success: false,
            message: "All field required",
        });
    }
    try {
        const checkCodeExists = await prisma.repairOrderTypeMaster.findFirst({
            where: { code: code, tenantId: Number(tenantId) }
        })
        if (checkCodeExists) {
            return res.status(403).json({
                success: false,
                message: `Repair order already exists with code ${code}`
            })
        }
        const data = await prisma.repairOrderTypeMaster.create({
            data: {
                code: code,
                name: name,
                description: description || null,
                tenantId: Number(tenantId),
                isActive: true
            }
        })
        return res.status(201).json({
            success: true,
            message: `${data.name} repair order added`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}


export const updateRepairOrder = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { repairOrderId } = req.params;
    if (!repairOrderId) {
        return res.status(404).json({
            success: false,
            message: 'Repair order id required'
        })
    }
    const {
        code,
        name,
        description
    } = req.body;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    if (
        !code ||
        !name
    ) {
        return res.status(404).json({
            success: false,
            message: "All field required",
        });
    }
    try {
        const checkCodeExists = await prisma.repairOrderTypeMaster.findUnique({
            where: { id: Number(repairOrderId), tenantId: Number(tenantId)}
        })
        if (!checkCodeExists) {
            return res.status(403).json({
                success: false,
                message: `Repair order not exists with code ${code}`
            })
        }
        const data = await prisma.repairOrderTypeMaster.update({
            data: {
                code: code,
                name: name,
                description: description || null,
            },
            where: {
                id: Number(repairOrderId),
                tenantId: Number(tenantId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `${data.name} repair order updated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}


export const getListOfRepairOrder = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    try {
        const totalRepairOrder = await prisma.repairOrderTypeMaster.count({
            where: {
                tenantId: Number(tenantId)
            }
        })
        const repairOrderList = await prisma.repairOrderTypeMaster.findMany({
            where: {
                tenantId: Number(tenantId)
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                }
            }
        })
        return res.status(201).json({
            success: true,
            data: repairOrderList,
            count: totalRepairOrder
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}


export const getRepairOrderDetails = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { repairOrderId } = req.params;
    if (!repairOrderId) {
        return res.status(404).json({
            success: false,
            message: 'Repair order id required'
        })
    }
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    try {
        const checkCodeExists = await prisma.repairOrderTypeMaster.findUnique({
            where: { id: Number(repairOrderId), tenantId: Number(tenantId) },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                }
            }
        })
        if (!checkCodeExists) {
            return res.status(403).json({
                success: false,
                message: `Repair order not exists with code`
            })
        }
        return res.status(201).json({
            success: true,
            data: checkCodeExists
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}

export const deactivateRepairOrder = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { repairOrderId } = req.params;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    if (!repairOrderId) {
        return res.status(404).json({
            success: false,
            message: "Repair order id required",
        });
    }
    try {
        const data = await prisma.repairOrderTypeMaster.update({
            where: { id: Number(repairOrderId), tenantId: Number(tenantId) },
            data: {
                isActive: false,
            },
        });
        return res.status(200).json({
            success: true,
            message: `${data.name} repair order is deactivated`,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `server error : ${err}`
        });
    }
};

export const activateRepairOrder = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { repairOrderId } = req.params;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    if (!repairOrderId) {
        return res.status(404).json({
            success: false,
            message: "Repair order id required",
        });
    }
    try {
        const data = await prisma.repairOrderTypeMaster.update({
            where: { id: Number(repairOrderId), tenantId: Number(tenantId) },
            data: {
                isActive: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: `${data.name} repair order is activated`,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }
};