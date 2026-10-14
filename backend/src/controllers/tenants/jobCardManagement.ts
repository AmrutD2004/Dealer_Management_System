import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";
import GetFiscalYear from "get-fiscal-year";
import dayjs from 'dayjs'
interface custVoices {
    id?: number,
    labourId: number,
    customerVoiceDescription: string,
    observation: string
}
export const createJobCard = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not Authorized'
        })
    }
    const { branchId, breakdownDateTime, breakdownEndDateTime, breakdownPersonAttended, breakdownStartDateTime, closedAt, currentKmReading, customerId, dealerVanEndKm, dealerVanStartKm, driverMobileNo, driverName, estimateCloseJobcardAt, isBreakDown, isRevisit, previousKmReading, repairOrderTypeId, serviceCategoryId, serviceTypeId, supervisorId, technicianId, vehicleId, vehicleStatus, customerVoices } = req.body

    if (!branchId || !currentKmReading || !customerId || !estimateCloseJobcardAt || !repairOrderTypeId || !serviceCategoryId || !serviceTypeId || !vehicleId || !vehicleStatus || customerVoices == null) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const getFinacialYear = () => {
            const get = new GetFiscalYear();
            const Years = get.getFiscalYear("IN", "current");
            const current = dayjs(Years.fiscalYearStart.split('T')[0]).format('YY');
            const next = dayjs(Years.fiscalYearEnd.split('T')[0]).format('YY');
            return { current, next };
        };

        const { current, next } = getFinacialYear();
        const fiscalYear = `${current}${next}`;
        const prefix = `JC-BR${branchId}-${fiscalYear}-`;

        const lastJobCard = await prisma.jobCard.findFirst({
            where: {
                tenantId: Number(tenantId),
                branchId: Number(branchId),
                jobCardNo: { startsWith: prefix },
            },
            orderBy: { jobCardNo: 'desc' },
            select: { jobCardNo: true },
        });

        const lastSeq = lastJobCard
            ? Number(lastJobCard.jobCardNo.split('-').pop())
            : 0;

        const nextSeq = (lastSeq + 1).toString().padStart(5, '0');
        const jobCardNo = `${prefix}${nextSeq}`;

        const isJobCardExists = await prisma.jobCard.findUnique({
            where: {
                tenantId_jobCardNo: {
                    tenantId: Number(tenantId),
                    jobCardNo: jobCardNo
                },
                status: 'OPEN'
            }
        })
        if (isJobCardExists) {
            return res.status(403).json({
                success: false,
                message: "An open job card already exists for this vehicle.",
            })
        }
        const result = await prisma.$transaction(async (tx) => {
            //Creating Job card
            const jobcard = await tx.jobCard.create({
                data: {
                    branchId: Number(branchId),
                    breakdownDateTime: breakdownDateTime || null,
                    breakdownEndDateTime: breakdownEndDateTime || null,
                    breakdownPersonAttended: breakdownPersonAttended || null,
                    breakdownStartDateTime: breakdownStartDateTime || null,
                    closedAt: closedAt || null,
                    createdBy: Number(id),
                    currentKmReading: currentKmReading,
                    customerId: Number(customerId),
                    dealerVanEndKm: dealerVanEndKm || null,
                    dealerVanStartKm: dealerVanStartKm || null,
                    driverName: driverName || null,
                    driverMobileNo: driverMobileNo || null,
                    estimateCloseAt: estimateCloseJobcardAt,
                    isBreakdown: isBreakDown,
                    isRevisit: isRevisit,
                    jobCardNo: jobCardNo,
                    previousKmReading: previousKmReading,
                    repairOrderTypeId: Number(repairOrderTypeId),
                    revisedEstimateCloseAt: null,
                    serviceCategoryId: Number(serviceCategoryId),
                    serviceTypeId: Number(serviceTypeId),
                    status: 'OPEN',
                    supervisorId: Number(supervisorId) || null,
                    technicianId: Number(technicianId) || null,
                    tenantId: Number(tenantId),
                    vehicleId: Number(vehicleId),
                    vehicleStatus: vehicleStatus

                }
            })
            const jobcardcustvoice = await tx.jobCardCustomerVoice.createMany({
                data: customerVoices.map((voices: custVoices) => ({
                    actionToBeTaken: Number(voices.labourId),
                    customerVoiceDescription: voices.customerVoiceDescription,
                    observation: voices.observation,
                    jobCardId: Number(jobcard.id)
                }))
            })
            return {
                jobcard,
                jobcardcustvoice
            }
        })
        return res.status(201).json({
            success: true,
            message: `Job card created with number ${result.jobcard.jobCardNo}`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}


export const updateJobCard = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { jobCardId } = req.params;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not Authorized'
        })
    }
    if (!jobCardId) {
        return res.status(403).json({
            success: false,
            message: 'job card is required'
        })
    }
    const { branchId, breakdownDateTime, breakdownEndDateTime, breakdownPersonAttended, breakdownStartDateTime, closedAt, currentKmReading, customerId, dealerVanEndKm, dealerVanStartKm, driverMobileNo, driverName, estimateCloseJobcardAt, isBreakDown, isRevisit, previousKmReading, repairOrderTypeId, serviceCategoryId, serviceTypeId, supervisorId, technicianId, vehicleId, vehicleStatus, revisedEstimateCloseAt, customerVoices } = req.body

    if (!branchId || !currentKmReading || !customerId || !estimateCloseJobcardAt || !repairOrderTypeId || !serviceCategoryId || !serviceTypeId || !vehicleId || !vehicleStatus || customerVoices == null) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {

        const isJobCardExists = await prisma.jobCard.findUnique({
            where: {
                tenantId: Number(tenantId),
                id: Number(jobCardId)
            }
        })
        if (!isJobCardExists) {
            return res.status(403).json({
                success: false,
                message: "job card not exists.",
            })
        }
        const result = await prisma.$transaction(async (tx) => {
            const jobcard = await prisma.jobCard.update({
                data: {
                    branchId: Number(branchId),
                    breakdownDateTime: breakdownDateTime || null,
                    breakdownEndDateTime: breakdownEndDateTime || null,
                    breakdownPersonAttended: breakdownPersonAttended || null,
                    breakdownStartDateTime: breakdownStartDateTime || null,
                    closedAt: closedAt || null,
                    createdBy: Number(id),
                    currentKmReading: currentKmReading,
                    customerId: Number(customerId),
                    dealerVanEndKm: dealerVanEndKm || null,
                    dealerVanStartKm: dealerVanStartKm || null,
                    driverName: driverName || null,
                    driverMobileNo: driverMobileNo || null,
                    estimateCloseAt: estimateCloseJobcardAt,
                    isBreakdown: isBreakDown,
                    isRevisit: isRevisit,
                    previousKmReading: previousKmReading,
                    repairOrderTypeId: Number(repairOrderTypeId),
                    revisedEstimateCloseAt: revisedEstimateCloseAt,
                    serviceCategoryId: Number(serviceCategoryId),
                    serviceTypeId: Number(serviceTypeId),
                    status: 'OPEN',
                    supervisorId: Number(supervisorId) || null,
                    technicianId: Number(technicianId) || null,
                    tenantId: Number(tenantId),
                    vehicleId: Number(vehicleId),
                    vehicleStatus: vehicleStatus,

                },
                where: {
                    id: Number(jobCardId),
                    tenantId: Number(tenantId)
                }
            })
            await Promise.all(
                customerVoices.map((voice: custVoices) => (
                    tx.jobCardCustomerVoice.update({
                        where: {
                            id: Number(voice.id)
                        },
                        data: {
                            actionToBeTaken: Number(voice.labourId),
                            customerVoiceDescription: voice.customerVoiceDescription,
                            observation: voice.observation
                        }
                    })
                ))
            )
            return {
                jobcard
            }
        })
        return res.status(201).json({
            success: true,
            message: `Job card updated with number ${result.jobcard.jobCardNo}`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}


export const getJobcardDetails = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { jobCardId } = req.params;
    if (!jobCardId) {
        return res.status(403).json({
            success: false,
            message: 'job card Id required'
        })
    }

    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }

    try {
        const isJobCardExists = await prisma.jobCard.findUnique({
            where: {
                id: Number(jobCardId),
                tenantId: Number(tenantId)
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                },
                customer: true,
                vehicle: true,
                serviceType: true,
                serviceCategory: true,
                repairOrderType: true,
                supervisor: true,
                technician: true,
                createdByUser: true,
                branch: true,
                jobCardCustomerVoices: {
                    select: {
                        labour: true,
                        customerVoiceDescription: true,
                        observation: true
                    }
                }
            }
        })
        if (!isJobCardExists) {
            return res.status(403).json({
                success: false,
                message: `Job card not exists`
            })
        }
        return res.status(201).json({
            success: true,
            data: isJobCardExists
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}

export const getListOfJobCard = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { skip, take } = req.query;

    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }

    try {
        const totalJobCards = await prisma.jobCard.count({
            where: {
                tenantId: Number(tenantId)
            }
        })
        let listOfJobCard
        if (skip || take) {
            listOfJobCard = await prisma.jobCard.findMany({
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
                    },
                    customer: true,
                    vehicle: true,
                    serviceType: true,
                    serviceCategory: true,
                    repairOrderType: true,
                    supervisor: true,
                    technician: true,
                    createdByUser: true,
                    branch: true,
                    jobCardCustomerVoices: {
                        select: {
                            labour: true,
                            customerVoiceDescription: true,
                            observation: true
                        }
                    }
                }
            })
        } else {
            listOfJobCard = await prisma.jobCard.findMany({
                where: {
                    tenantId: Number(tenantId)
                },
                include: {
                    tenant: {
                        select: {
                            tenantName: true
                        }
                    },
                    customer: true,
                    vehicle: true,
                    serviceType: true,
                    serviceCategory: true,
                    repairOrderType: true,
                    supervisor: true,
                    technician: true,
                    createdByUser: true,
                    branch: true,
                    jobCardCustomerVoices: {
                        select: {
                            labour: true,
                            customerVoiceDescription: true,
                            observation: true
                        }
                    }
                }
            })
        }
        return res.status(201).json({
            success: true,
            data: listOfJobCard,
            count: totalJobCards
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}


export const closeJobCard = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { jobCardId } = req.params;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    if (!jobCardId) {
        return res.status(404).json({
            success: false,
            message: "job card id required",
        });
    }
    try {
        const isJobCardExists = await prisma.jobCard.findUnique({
            where: {
                id: Number(jobCardId),
                tenantId: Number(tenantId)
            }
        })
        if (!isJobCardExists) {
            return res.status(403).json({
                success: false,
                message: `job card not exists`
            })
        }
        const data = await prisma.jobCard.update({
            where: { id: Number(jobCardId), tenantId: Number(tenantId) },
            data: {
                status: 'CLOSED',
            },
        });
        return res.status(200).json({
            success: true,
            message: `Job card with ${data.jobCardNo} is closed`,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `server error : ${err}`
        });
    }
};