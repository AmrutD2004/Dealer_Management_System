import { Request, Response } from "express";
import { prisma } from "../../../prisma/lib/prisma";
import { Prisma } from "../../../generated/prisma/client";
import GetFiscalYear from "get-fiscal-year";
import dayjs from "dayjs";

export const createAppointment = async (req: Request, res: Response) => {
    const { id, tenantId, branchId } = req.user!
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    const { action, status, vehicleId, customerId, currentReading, serviceCategoryId, serviceTypeId, repairOrderTypeId, customerVoices, originalAppointmentId, creId, serviceAdvisorId, cancleReason, estimateCharge, appointOn, callDateAndTime, source } = req.body;

    if (!action || !status || !vehicleId || !customerId || !serviceTypeId || !repairOrderTypeId || customerVoices === null || !serviceCategoryId || !creId || !serviceAdvisorId || !appointOn || !callDateAndTime || !source) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isVehicleExists = await prisma.vehicle.findUnique({
            where: {
                id: Number(vehicleId)
            }
        })
        if (!isVehicleExists) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            })
        }
        const isCustomerExists = await prisma.customer.findUnique({
            where: {
                id: Number(customerId)
            }
        })
        if (!isCustomerExists) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            })
        }
        const isServiceCategoryExists = await prisma.serviceCategoryMaster.findUnique({
            where: {
                id: Number(serviceCategoryId)
            }
        })
        if (!isServiceCategoryExists) {
            return res.status(404).json({
                success: false,
                message: 'Service Category not found'
            })
        }
        const isServiceTypeExists = await prisma.serviceTypeMaster.findUnique({
            where: {
                id: Number(serviceTypeId)
            }
        })
        if (!isServiceTypeExists) {
            return res.status(404).json({
                success: false,
                message: 'Service type not found'
            })
        }
        const isRepairOrderTypeExists = await prisma.repairOrderTypeMaster.findUnique({
            where: {
                id: Number(repairOrderTypeId)
            }
        })
        if (!isRepairOrderTypeExists) {
            return res.status(404).json({
                success: false,
                message: 'Repair order type not found'
            })
        }
        const isBranchExists = await prisma.branch.findUnique({
            where: {
                id: Number(branchId)
            },
            select: {
                branchCode: true
            }
        })
        const getFinacialYear = () => {
            const get = new GetFiscalYear();
            const Years = get.getFiscalYear("IN", "current");
            const current = dayjs(Years.fiscalYearStart.split('T')[0]).format('YY');
            const next = dayjs(Years.fiscalYearEnd.split('T')[0]).format('YY');
            return { current, next };
        };

        const { current, next } = getFinacialYear();
        const fiscalYear = `${current}${next}`;
        const prefix = `APP${isBranchExists?.branchCode}${fiscalYear}`;
        const lastServiceQuotation = await prisma.serviceAppointment.findFirst({
            where: {
                tenantId: Number(tenantId),
                appointmentNo: { startsWith: prefix },
            },
            orderBy: { appointmentNo: 'desc' },
            select: { appointmentNo: true },
        });

        let lastSeq = 0
        if (lastServiceQuotation) {
            const sequencePart =
                lastServiceQuotation.appointmentNo.slice(prefix.length);

            lastSeq = Number(sequencePart);

            if (!/^\d{9}$/.test(sequencePart) || !Number.isSafeInteger(lastSeq)) {
                throw new Error("Invalid existing appointment number sequence");
            }
        }

        const nextSeq = (lastSeq + 1).toString().padStart(9, '0');
        const appointmentNo = `${prefix}${nextSeq}`;
        const result = await prisma.$transaction(async (tx) => {
            const appointment = await tx.serviceAppointment.create({
                data: {
                    action: action,
                    tenantId: Number(tenantId),
                    branchId: Number(branchId),
                    appointmentNo: appointmentNo,
                    originalAppointmentId: action === "RE_SCHEDULE" ? Number(originalAppointmentId) : null,
                    status: status,
                    vehicleId: Number(vehicleId),
                    customerId: Number(customerId),
                    currentReading: currentReading ? currentReading : null,
                    serviceCategoryId: Number(serviceCategoryId),
                    serviceTypeId: Number(serviceTypeId),
                    repairOrderTypeId: Number(repairOrderTypeId),
                    creId: Number(creId),
                    serviceAdvisorId: Number(serviceAdvisorId),
                    cancleReason: cancleReason ? cancleReason : null,
                    estimateCharge: estimateCharge ? new Prisma.Decimal(estimateCharge) : null,
                    appointOn: new Date(appointOn),
                    callDateAndTime: new Date(callDateAndTime),
                    source: source

                }
            })
            if (!Array.isArray(customerVoices)) {
                throw new Error('Customer Voice must be in array')
            }
            const appointmentCutomerVoice = await tx.serviceAppointmentCustomerVoice.createMany({
                data: customerVoices.map((customer) => ({
                    tenantId: Number(tenantId),
                    serviceAppointmentId: Number(appointment.id),
                    customerVoice: (customer.customerVoice)

                }))
            })
            return {
                appointment,
                appointmentCutomerVoice
            }
        });


        return res.status(201).json({
            success: true,
            message: "Service Appointment created successfully",
            data: result,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }
}


export const getListOfServiceAppointment = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { skip, take } = req.query;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        let listOfServiceAppointment
        const totalServiceAppointment = await prisma.serviceAppointment.count({
            where: {
                tenantId: Number(tenantId)
            }
        })
        if (skip || take) {
            listOfServiceAppointment = await prisma.serviceAppointment.findMany({
                skip: Number(skip),
                take: Number(take),
                where: {
                    tenantId: Number(tenantId)
                },
                include: {
                    originalAppointment: true,
                    customer: {
                        include: {
                            authorizedByUser: {
                                select: {
                                    id: true,
                                    employeeCode: true,
                                    firstName: true,
                                    middleName: true,
                                    lastName: true,
                                    email: true,
                                    mobileNo: true
                                }
                            }
                        }
                    },
                    vehicle: {
                        include: {
                            model: true,
                            brand: true,
                            variant: true
                        }
                    },
                    serviceCategory: true,
                    serviceType: true,
                    repairOrderType: true,
                    serviceAppointmentCustomerVoice: true,
                    branch: true,
                    cre: {
                        select: {
                            firstName: true,
                            middleName: true,
                            lastName: true,
                            employeeCode: true,
                            id: true,
                            email: true,
                            mobileNo: true
                        }
                    },
                    serviceAdvisor: {
                        select: {
                            firstName: true,
                            middleName: true,
                            lastName: true,
                            employeeCode: true,
                            id: true,
                            email: true,
                            mobileNo: true
                        }
                    }
                }
            })
        } else {
            listOfServiceAppointment = await prisma.serviceAppointment.findMany({
                where: {
                    tenantId: Number(tenantId)
                },
                include: {
                    originalAppointment: true,
                    customer: {
                        include: {
                            authorizedByUser: {
                                select: {
                                    id: true,
                                    employeeCode: true,
                                    firstName: true,
                                    middleName: true,
                                    lastName: true,
                                    email: true,
                                    mobileNo: true
                                }
                            }
                        }
                    },
                    vehicle: {
                        include: {
                            model: true,
                            brand: true,
                            variant: true
                        }
                    },
                    serviceCategory: true,
                    serviceType: true,
                    repairOrderType: true,
                    serviceAppointmentCustomerVoice: true,
                    branch: true,
                    cre: {
                        select: {
                            firstName: true,
                            middleName: true,
                            lastName: true,
                            employeeCode: true,
                            id: true,
                            email: true,
                            mobileNo: true
                        }
                    },
                    serviceAdvisor: {
                        select: {
                            firstName: true,
                            middleName: true,
                            lastName: true,
                            employeeCode: true,
                            id: true,
                            email: true,
                            mobileNo: true
                        }
                    }
                }
            })
            return res.status(200).json({
                success: true,
                data: listOfServiceAppointment,
                count: totalServiceAppointment
            })
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }
}


export const getServiceAppointmentDetails = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { serviceAppointmentId } = req.params;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!serviceAppointmentId) {
        return res.status(404).json({
            success: false,
            message: 'Service Quotation id required'
        })
    }
    try {
        const isServiceAppointmentExists = await prisma.serviceAppointment.findUnique({
            where: {
                id: Number(serviceAppointmentId)
            },
            include: {
                originalAppointment: true,
                customer: {
                    include: {
                        authorizedByUser: {
                            select: {
                                id: true,
                                employeeCode: true,
                                firstName: true,
                                middleName: true,
                                lastName: true,
                                email: true,
                                mobileNo: true
                            }
                        }
                    }
                },
                vehicle: {
                    include: {
                        model: true,
                        brand: true,
                        variant: true
                    }
                },
                serviceCategory: true,
                serviceType: true,
                repairOrderType: true,
                serviceAppointmentCustomerVoice: true,
                branch: true,
                cre: {
                    select: {
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        employeeCode: true,
                        id: true,
                        email: true,
                        mobileNo: true
                    }
                },
                serviceAdvisor: {
                    select: {
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        employeeCode: true,
                        id: true,
                        email: true,
                        mobileNo: true
                    }
                }
            }
        })
        if (!isServiceAppointmentExists) {
            return res.status(404).json({
                success: false,
                message: 'Service Appointment not found'
            })
        }
        return res.status(200).json({
            success: true,
            data: isServiceAppointmentExists
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }
}

export const updateAppointment = async (req: Request, res: Response) => {
    const { id, tenantId, branchId } = req.user!
    const { serviceAppointmentId } = req.params;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!serviceAppointmentId) {
        return res.status(404).json({
            success: false,
            message: 'Service Quotation id required'
        })
    }
    const { action, status, vehicleId, customerId, currentReading, serviceCategoryId, serviceTypeId, repairOrderTypeId, customerVoices, originalAppointmentId, creId, serviceAdvisorId, cancleReason, estimateCharge, appointOn, callDateAndTime, source } = req.body;

    if (!action || !status || !vehicleId || !customerId || !serviceTypeId || !repairOrderTypeId || !serviceCategoryId || !creId || !serviceAdvisorId || !appointOn || !callDateAndTime || !source) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isServiceAppointmentExists = await prisma.serviceAppointment.findUnique({
            where: {
                id: Number(serviceAppointmentId)
            }
        })
        if (!isServiceAppointmentExists) {
            return res.status(404).json({
                success: false,
                message: 'Service Appointment not found'
            })
        }
        const isVehicleExists = await prisma.vehicle.findUnique({
            where: {
                id: Number(vehicleId)
            }
        })
        if (!isVehicleExists) {
            return res.status(404).json({
                success: false,
                message: 'Vehicle not found'
            })
        }
        const isCustomerExists = await prisma.customer.findUnique({
            where: {
                id: Number(customerId)
            }
        })
        if (!isCustomerExists) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            })
        }
        const isServiceCategoryExists = await prisma.serviceCategoryMaster.findUnique({
            where: {
                id: Number(serviceCategoryId)
            }
        })
        if (!isServiceCategoryExists) {
            return res.status(404).json({
                success: false,
                message: 'Service Category not found'
            })
        }
        const isServiceTypeExists = await prisma.serviceTypeMaster.findUnique({
            where: {
                id: Number(serviceTypeId)
            }
        })
        if (!isServiceTypeExists) {
            return res.status(404).json({
                success: false,
                message: 'Service type not found'
            })
        }
        const isRepairOrderTypeExists = await prisma.repairOrderTypeMaster.findUnique({
            where: {
                id: Number(repairOrderTypeId)
            }
        })
        if (!isRepairOrderTypeExists) {
            return res.status(404).json({
                success: false,
                message: 'Repair order type not found'
            })
        }
        const isBranchExists = await prisma.branch.findUnique({
            where: {
                id: Number(branchId)
            },
            select: {
                branchCode: true
            }
        })

        const result = await prisma.$transaction(async (tx) => {
            const appointment = await tx.serviceAppointment.update({
                data: {
                    action: action,
                    tenantId: Number(tenantId),
                    branchId: Number(branchId),
                    originalAppointmentId: action === "RE_SCHEDULE" ? Number(originalAppointmentId) : null,
                    status: status,
                    vehicleId: Number(vehicleId),
                    customerId: Number(customerId),
                    currentReading: currentReading ? currentReading : null,
                    serviceCategoryId: Number(serviceCategoryId),
                    serviceTypeId: Number(serviceTypeId),
                    repairOrderTypeId: Number(repairOrderTypeId),
                    creId: Number(creId),
                    serviceAdvisorId: Number(serviceAdvisorId),
                    cancleReason: cancleReason ? cancleReason : null,
                    estimateCharge: estimateCharge ? new Prisma.Decimal(estimateCharge) : null,
                    appointOn: new Date(appointOn),
                    callDateAndTime: new Date(callDateAndTime),
                    source: source

                },
                where: {
                    id: Number(serviceAppointmentId)
                },
                include: {
                    cre: {
                        select: {
                            firstName: true,
                            middleName: true,
                            lastName: true,
                            employeeCode: true,
                            id: true,
                            email: true,
                            mobileNo: true
                        }
                    },
                    serviceAdvisor: {
                        select: {
                            firstName: true,
                            middleName: true,
                            lastName: true,
                            employeeCode: true,
                            id: true,
                            email: true,
                            mobileNo: true
                        }
                    },
                    serviceAppointmentCustomerVoice: true
                }
            })
            if (!Array.isArray(customerVoices)) {
                throw new Error('Customer Voice must be in array')
            }
            // 1. Delete all existing customer voices for this appointment
            await tx.serviceAppointmentCustomerVoice.deleteMany({
                where: {
                    serviceAppointmentId: Number(serviceAppointmentId),
                },
            });

            // 2. Insert the newly submitted customer voices
            if (customerVoices.length > 0) {
                await tx.serviceAppointmentCustomerVoice.createMany({
                    data: customerVoices.map((voice) => ({
                        tenantId: Number(tenantId),
                        serviceAppointmentId: Number(serviceAppointmentId),
                        customerVoice: voice.customerVoice,
                    })),
                });
            }
            return {
                appointment,
            }
        });


        return res.status(201).json({
            success: true,
            message: "Service Appointment updated successfully",
            data: result,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }
}

export const searchedServiceAppointment = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { serviceAppointmentNo } = req.query;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }

    try {
        const data = await prisma.serviceAppointment.findMany({
            where: {
                appointmentNo: {
                    contains: String(serviceAppointmentNo),
                    mode: 'insensitive'
                },
                tenantId: Number(tenantId)
            },
            include: {
                repairOrderType: true,
                serviceCategory: true,
                serviceType: true,
                vehicle: true,
                customer: true,
                serviceAppointmentCustomerVoice: true,
                cre: {
                    select: {
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        employeeCode: true,
                        id: true,
                        email: true,
                        mobileNo: true
                    }
                },
                serviceAdvisor: {
                    select: {
                        firstName: true,
                        middleName: true,
                        lastName: true,
                        employeeCode: true,
                        id: true,
                        email: true,
                        mobileNo: true
                    }
                }
            }
        })
        if (!data) {
            return res.status(404).json({
                success: true,
                message: 'Quotation not found'
            })
        }
        return res.status(200).json({
            success: true,
            data: data
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }
}


export const cancleAppointment = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { serviceAppointmentId } = req.params;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!serviceAppointmentId) {
        return res.status(404).json({
            success: false,
            message: 'Service Quotation id required'
        })
    }
    const { cancleReason } = req.body;

    if (!cancleReason) {
        return res.status(400).json({
            success: false,
            message: 'Cancle Reason required'
        })
    }
    try {
        const isServiceAppointmentExists = await prisma.serviceAppointment.findUnique({
            where: {
                id: Number(serviceAppointmentId)
            }
        })
        if (!isServiceAppointmentExists) {
            return res.status(404).json({
                success: false,
                message: 'Service Appointment not found'
            })
        }
        const data = await prisma.serviceAppointment.update({
            data: {
                status: 'CANCEL',
                cancleReason: cancleReason
            },
            where: {
                id: Number(serviceAppointmentId)
            }
        })

        return res.status(201).json({
            success: true,
            message: `Service Appointment ${data.appointmentNo} cancled.`,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }
}