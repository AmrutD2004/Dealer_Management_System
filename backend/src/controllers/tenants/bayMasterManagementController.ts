import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";

export const createBay = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { bayCode, bayName, branchId, description } = req.body;

    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }

    if (!bayCode || !bayName || !branchId) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }

    try {
        const isBayExists = await prisma.dealerBayMaster.findUnique({
            where: {
                branchId_bayCode: {
                    branchId: Number(branchId),
                    bayCode: bayCode,
                }
            },
            include: {
                branch: {
                    select: {
                        branchName: true
                    }
                },
                tenant: {
                    select: {
                        tenantName: true
                    }
                }
            }
        })
        if (isBayExists) {
            return res.status(403).json({
                success: false,
                message: `Bay already exists in branch ${isBayExists.branch.branchName} of tenant ${isBayExists.tenant.tenantName}`
            })
        }

        const data = await prisma.dealerBayMaster.create({
            data: {
                bayCode: bayCode,
                bayName: bayName,
                description: description || null,
                branchId: Number(branchId),
                tenantId: Number(tenantId),
                isActive: true
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
            message: `Bay ${data.bayName} is added in ${data.tenant.tenantName} successfully`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}

export const updateBay = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { bayId } = req.params;
    const { bayCode, bayName, branchId, description } = req.body;


    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!bayId) {
        return res.status(403).json({
            success: true,
            message: 'Bay id required'
        })
    }
    if (!bayCode || !bayName || !branchId) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }

    try {
        const isBayExists = await prisma.dealerBayMaster.findUnique({
            where: {
                id: Number(bayId)
            }
        })
        if (!isBayExists) {
            return res.status(403).json({
                success: false,
                message: `Bay not exists`
            })
        }

        const data = await prisma.dealerBayMaster.update({
            data: {
                bayCode: bayCode,
                bayName: bayName,
                description: description || null,
                branchId: Number(branchId),
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                }
            },
            where: {
                id: Number(bayId),
                tenantId: Number(tenantId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `Bay ${data.bayName} is updates`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}

export const getListOfBay = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { skip, take } = req.query;


    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }

    try {
        const totalBayInTenant = await prisma.dealerBayMaster.count({
            where: {
                tenantId: Number(tenantId)
            }
        })
        let listOfBay
        if (skip || take) {
            listOfBay = await prisma.dealerBayMaster.findMany({
                skip: Number(skip),
                take: Number(take),
                where: {
                    tenantId: Number(tenantId)
                },
                include: {
                    branch: true,
                    tenant: true
                }
            })
        } else {
            listOfBay = await prisma.dealerBayMaster.findMany({
                where: {
                    tenantId: Number(tenantId)
                },
                include: {
                    branch: true,
                    tenant: true
                }
            })
        }

        return res.status(201).json({
            success: true,
            data: listOfBay,
            count: totalBayInTenant
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}

export const getBayDetails = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { bayId } = req.params;


    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!bayId) {
        return res.status(403).json({
            success: true,
            message: 'Bay id required'
        })
    }

    try {
        const isBayExists = await prisma.dealerBayMaster.findUnique({
            where: {
                id: Number(bayId)
            },
            include: {
                branch: true,
                tenant: true
            }
        })
        if (!isBayExists) {
            return res.status(403).json({
                success: false,
                message: `Bay not exists`
            })
        }

        return res.status(201).json({
            success: true,
            data: isBayExists
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}

export const deactivateBay = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { bayId } = req.params;


    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!bayId) {
        return res.status(403).json({
            success: true,
            message: 'Bay id required'
        })
    }

    try {
        const isBayExists = await prisma.dealerBayMaster.findUnique({
            where: {
                id: Number(bayId)
            }
        })
        if (!isBayExists) {
            return res.status(403).json({
                success: false,
                message: `Bay not exists`
            })
        }
        const data = await prisma.dealerBayMaster.update({
            where: {
                id: Number(bayId)
            },
            data: {
                isActive: false
            }
        })
        return res.status(201).json({
            success: true,
            data: `Bay ${data.bayName} is deactivated`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}


export const activateBay = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { bayId } = req.params;


    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!bayId) {
        return res.status(403).json({
            success: true,
            message: 'Bay id required'
        })
    }

    try {
        const isBayExists = await prisma.dealerBayMaster.findUnique({
            where: {
                id: Number(bayId)
            }
        })
        if (!isBayExists) {
            return res.status(403).json({
                success: false,
                message: `Bay not exists`
            })
        }
        const data = await prisma.dealerBayMaster.update({
            where: {
                id: Number(bayId)
            },
            data: {
                isActive: true
            }
        })
        return res.status(201).json({
            success: true,
            data: `Bay ${data.bayName} is deactivated`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}