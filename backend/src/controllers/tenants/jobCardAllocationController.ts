import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";

export const allocateJobCard = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { bayId, bayInDateTime, jobCardId, mechanicId } = req.body;

    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }

    if (!bayId || !bayInDateTime || !jobCardId || !mechanicId) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }

    try {
        const existingAllocation = await prisma.jobCardAllocation.findFirst({
            where: {
                jobCardId: Number(jobCardId),
                bayOutTime: null,
            },
        });

        if (existingAllocation) {
            return res.status(409).json({
                success: false,
                message: "This job card already has an active bay allocation.",
                data: existingAllocation,
            });
        }
        const existingBayAllocation =
            await prisma.jobCardAllocation.findFirst({
                where: {
                    bayId: Number(bayId),
                    bayOutTime: null,
                },
            });

        if (existingBayAllocation) {
            return res.status(409).json({
                success: false,
                message: "This bay is already occupied.",
            });
        }
        const checkIsMechanic = await prisma.users.findUnique({
            where: {
                id: Number(mechanicId)
            },
            include: {
                role: {
                    select: {
                        roleCode: true
                    }
                }
            }
        })
        if (checkIsMechanic?.role.roleCode !== 'MECHANIC') {
            return res.status(401).json({
                success: false,
                message: 'User is not a mechanic. please select mechanic'
            })
        }

        const data = await prisma.jobCardAllocation.create({
            data: {
                bayId: Number(bayId),
                mechanicId: Number(mechanicId),
                jobCardId: Number(jobCardId),
                bayInDateTime: bayInDateTime
            },
            include: {
                jobCard: true,
                mechanic: true,
                bay: true
            }
        })
        return res.status(201).json({
            success: true,
            message: `Job Card ${data.jobCard.jobCardNo} is allocated to ${data.mechanic.firstName} ${data.mechanic.lastName} at ${data.bay.bayName} bay.`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}


export const updateAllocatedJobCard = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { allocatedId } = req.params;
    const { bayId, bayInDateTime, jobCardId, mechanicId } = req.body;

    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }

    if (!bayId || !bayInDateTime || !jobCardId || !mechanicId) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }

    try {
        const existingAllocation = await prisma.jobCardAllocation.findUnique({
            where: {
                id: Number(allocatedId)
            },
        });

        if (!existingAllocation) {
            return res.status(409).json({
                success: false,
                message: "This job card not allocated",
            });
        }
        const checkIsMechanic = await prisma.users.findUnique({
            where: {
                id: Number(mechanicId)
            },
            include: {
                role: {
                    select: {
                        roleCode: true
                    }
                }
            }
        })
        if (checkIsMechanic?.role.roleCode !== 'MECHANIC') {
            return res.status(401).json({
                success: false,
                message: 'User is not a mechanic. please select mechanic'
            })
        }

        const data = await prisma.jobCardAllocation.update({
            data: {
                bayId: Number(bayId),
                mechanicId: Number(mechanicId),
                jobCardId: Number(jobCardId),
                bayInDateTime: bayInDateTime
            },
            include: {
                jobCard: true,
                mechanic: true,
                bay: true
            },
            where: {
                id: Number(allocatedId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `Job Card ${data.jobCard.jobCardNo} is allocated to ${data.mechanic.firstName} ${data.mechanic.lastName} at ${data.bay.bayName} bay.`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}


export const getAllocatedJobCardDetails = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { allocatedId } = req.params;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }

    try {
        const existingAllocation = await prisma.jobCardAllocation.findUnique({
            where: {
                id: Number(allocatedId)
            },
            include: {
                jobCard: true,
                mechanic: true,
                bay: true
            },
        });

        if (!existingAllocation) {
            return res.status(409).json({
                success: false,
                message: "This job card not allocated",
            });
        }

        return res.status(201).json({
            success: true,
            data: existingAllocation
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}


export const getListOfAllocatedJobCards = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { skip, take } = req.query;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }

    try {
        const totalAllocatedJobCards = await prisma.jobCardAllocation.count({
            where: {
                jobCard: {
                    tenantId: Number(tenantId)
                }
            }
        })
        let listOfJobcardAllocation
        if (skip || take) {
            listOfJobcardAllocation = await prisma.jobCardAllocation.findMany({
                skip : Number(skip),
                take : Number(take),
                where: {
                    jobCard: {
                        tenantId: Number(tenantId)
                    }
                },
                include : {
                    jobCard : true,
                    bay : true,
                    mechanic : true
                }
            })
        }else {
            listOfJobcardAllocation = await prisma.jobCardAllocation.findMany({
                where: {
                    jobCard: {
                        tenantId: Number(tenantId)
                    }
                },
                include : {
                    jobCard : true,
                    bay : true,
                    mechanic : true
                }
            })
        }
        return res.status(201).json({
            success: true,
            data: listOfJobcardAllocation,
            count : totalAllocatedJobCards
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}



