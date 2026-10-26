import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";

export const createHSN = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { hsnCode, taxRate, description } = req.body;

    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }

    if (!hsnCode) {
        return res.status(400).json({
            success: false,
            message: 'HSN code is required'
        })
    }

    try {
        const isHsnCodeExists = await prisma.hSNMaster.findUnique({
            where: {
                tenantId_hsnCode: {
                    tenantId: Number(tenantId),
                    hsnCode: hsnCode,
                }
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                }
            }
        })
        if (isHsnCodeExists) {
            return res.status(403).json({
                success: false,
                message: `HSN is already exists in  tenant ${isHsnCodeExists.tenant.tenantName}`
            })
        }

        const data = await prisma.hSNMaster.create({
            data: {
                hsnCode: hsnCode,
                taxRate: parseFloat(taxRate) || null,
                description: description || null,
                tenantId : Number(tenantId)
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
            message: `HSN code ${data.hsnCode} is added in ${data.tenant.tenantName} successfully`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}

export const updateHSN = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { hsnId } = req.params;
    const { hsnCode, taxRate, description } = req.body;


    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!hsnId) {
        return res.status(403).json({
            success: true,
            message: 'hsn id required'
        })
    }
    if (!hsnCode) {
        return res.status(400).json({
            success: false,
            message: 'HSN code is required'
        })
    }

    try {
        const isHSNCodeExists = await prisma.hSNMaster.findUnique({
            where: {
                id: Number(hsnId)
            }
        })
        if (!isHSNCodeExists) {
            return res.status(403).json({
                success: false,
                message: `hsn not exists`
            })
        }

        const data = await prisma.hSNMaster.update({
            data: {
                hsnCode: hsnCode,
                taxRate: parseFloat(taxRate) || null,
                description: description || null,
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                }
            },
            where: {
                id: Number(hsnId),
                tenantId: Number(tenantId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `HSN ${data.hsnCode} is updated`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}

export const getListOfHSN = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { skip, take } = req.query;


    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }

    try {
        const totalHSNInTenant = await prisma.hSNMaster.count({
            where: {
                tenantId: Number(tenantId)
            }
        })
        let listOfHSN
        if (skip || take) {
            listOfHSN = await prisma.hSNMaster.findMany({
                skip: Number(skip),
                take: Number(take),
                where: {
                    tenantId: Number(tenantId)
                },
                include: {
                    tenant: true
                }
            })
        } else {
            listOfHSN = await prisma.hSNMaster.findMany({
                where: {
                    tenantId: Number(tenantId)
                },
                include: {
                    tenant: true
                }
            })
        }

        return res.status(201).json({
            success: true,
            data: listOfHSN,
            count: totalHSNInTenant
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}

export const getHSNDetails = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { hsnId } = req.params;


    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!hsnId) {
        return res.status(403).json({
            success: true,
            message: 'HSN id required'
        })
    }

    try {
        const isHSNCodeExists = await prisma.hSNMaster.findUnique({
            where: {
                id: Number(hsnId)
            },
            include: {
                tenant: true
            }
        })
        if (!isHSNCodeExists) {
            return res.status(403).json({
                success: false,
                message: `HSN not exists`
            })
        }

        return res.status(201).json({
            success: true,
            data: isHSNCodeExists
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}

export const deactivateHSN = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { hsnId } = req.params;


    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!hsnId) {
        return res.status(403).json({
            success: true,
            message: 'HSN id required'
        })
    }

    try {
        const isHSNCodeExists = await prisma.hSNMaster.findUnique({
            where: {
                id: Number(hsnId)
            }
        })
        if (!isHSNCodeExists) {
            return res.status(403).json({
                success: false,
                message: `HSN not exists`
            })
        }
        const data = await prisma.hSNMaster.update({
            where: {
                id: Number(hsnId)
            },
            data: {
                isActive: false
            }
        })
        return res.status(201).json({
            success: true,
            data: `HSN ${data.hsnCode} is deactivated`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}


export const activateHSN = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { hsnId } = req.params;


    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!hsnId) {
        return res.status(403).json({
            success: true,
            message: 'HSN id required'
        })
    }

    try {
        const isHSNCodeExists = await prisma.hSNMaster.findUnique({
            where: {
                id: Number(hsnId)
            }
        })
        if (!isHSNCodeExists) {
            return res.status(403).json({
                success: false,
                message: `HSN not exists`
            })
        }
        const data = await prisma.hSNMaster.update({
            where: {
                id: Number(hsnId)
            },
            data: {
                isActive: true
            }
        })
        return res.status(201).json({
            success: true,
            data: `HSN ${data.hsnCode} is activated`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}
