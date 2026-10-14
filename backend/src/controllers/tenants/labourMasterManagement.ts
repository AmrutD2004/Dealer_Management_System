import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";

export const createLabours = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const {
        labourCode,
        labourName,
        labourDescription,
        rate,
        standardHours
    } = req.body;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    if (
        !labourCode ||
        !labourName || !rate || !standardHours
    ) {
        return res.status(404).json({
            success: false,
            message: "All field required",
        });
    }
    try {
        const checkCodeExists = await prisma.labourMaster.findUnique({
            where: {
                tenantId_labourCode: {
                    tenantId: Number(tenantId),
                    labourCode: labourCode
                }
            }
        })
        if (checkCodeExists) {
            return res.status(403).json({
                success: false,
                message: `Labour already exists with code ${labourCode}`
            })
        }
        const data = await prisma.labourMaster.create({
            data: {
                labourCode: labourCode,
                labourName: labourName,
                labourDescription: labourDescription || null,
                tenantId: Number(tenantId),
                rate: parseFloat(rate),
                standardHours: parseFloat(standardHours),
                isActive: true
            }
        })
        return res.status(201).json({
            success: true,
            message: `${data.labourName} labour added`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}


export const updateLabours = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { labourId } = req.params;
    if (!labourId) {
        return res.status(403).json({
            success: true,
            message: 'Labour id required'
        })
    }
    const {
        labourCode,
        labourName,
        labourDescription,
        rate,
        standardHours
    } = req.body;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    if (
        !labourCode ||
        !labourName || !rate || !standardHours
    ) {
        return res.status(404).json({
            success: false,
            message: "All field required",
        });
    }
    try {
        const checkCodeExists = await prisma.labourMaster.findUnique({
            where: {
                id: Number(labourId),
                tenantId: Number(tenantId)
            }
        })
        if (!checkCodeExists) {
            return res.status(403).json({
                success: false,
                message: `Labour not exists`
            })
        }
        const data = await prisma.labourMaster.update({
            data: {
                labourCode: labourCode,
                labourName: labourName,
                labourDescription: labourDescription || null,
                rate: parseFloat(rate),
                standardHours: parseFloat(standardHours),
            },
            where: {
                id: Number(labourId),
                tenantId: Number(tenantId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `${data.labourName} labour updated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}




export const getListOfLabours = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { skip, take } = req.query;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    try {
        const totalLabours = await prisma.labourMaster.count({
            where: {
                tenantId: Number(tenantId)
            }
        })
        let laboursList
        if (skip || take) {
            laboursList = await prisma.labourMaster.findMany({
                skip: Number(skip),
                take: Number(take),
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
        } else {
            laboursList = await prisma.labourMaster.findMany({
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
        }
        return res.status(201).json({
            success: true,
            data: laboursList,
            count: totalLabours
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}


export const getLaboursDetails = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { labourId } = req.params;
    if (!labourId) {
        return res.status(403).json({
            success: true,
            message: 'Labour id required'
        })
    }
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    try {
        const checkCodeExists = await prisma.labourMaster.findUnique({
            where: {
                id: Number(labourId),
                tenantId: Number(tenantId)
            }
        })
        if (!checkCodeExists) {
            return res.status(403).json({
                success: false,
                message: `Labour not exists`
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

export const deactivateLabours = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { labourId } = req.params;
    if (!labourId) {
        return res.status(403).json({
            success: true,
            message: 'Labour id required'
        })
    }
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    try {
        const checkCodeExists = await prisma.labourMaster.findUnique({
            where: {
                id: Number(labourId),
                tenantId: Number(tenantId)
            }
        })
        if (!checkCodeExists) {
            return res.status(403).json({
                success: false,
                message: `Labour not exists`
            })
        }
        const data = await prisma.labourMaster.update({
            data: {
                isActive: false
            },
            where: {
                id: Number(labourId),
                tenantId: Number(tenantId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `${data.labourName} labour deactivated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}

export const activateLabours = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { labourId } = req.params;
    if (!labourId) {
        return res.status(403).json({
            success: true,
            message: 'Labour id required'
        })
    }
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    try {
        const checkCodeExists = await prisma.labourMaster.findUnique({
            where: {
                id: Number(labourId),
                tenantId: Number(tenantId)
            }
        })
        if (!checkCodeExists) {
            return res.status(403).json({
                success: false,
                message: `Labour not exists`
            })
        }
        const data = await prisma.labourMaster.update({
            data: {
                isActive: true
            },
            where: {
                id: Number(labourId),
                tenantId: Number(tenantId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `${data.labourName} labour deactivated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}