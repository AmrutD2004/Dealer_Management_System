
import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";

export const createVehicle = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { chassisNumber, color, currentOdometerReading, customerId, engineNumber, brandId, manufacturingYear, modelId, purchaseDate, registrationDate, variantId, vehicleNumber } = req.body;

    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }

    if (!modelId || !brandId || !engineNumber || !customerId || !currentOdometerReading || !chassisNumber || !variantId) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }

    try {
        const isVehicleExists = await prisma.vehicle.findUnique({
            where: {
                tenantId_chassisNumber: {
                    chassisNumber: chassisNumber,
                    tenantId: Number(tenantId)
                }
            },
            include: {
                customer: {
                    select: {
                        firstName: true,
                        lastName: true
                    }
                },
                tenant: {
                    select: {
                        tenantName: true
                    }
                }
            }
        })
        if (isVehicleExists) {
            return res.status(403).json({
                success: false,
                message: `Vehicle already exists of customer name ${isVehicleExists.customer.firstName} ${isVehicleExists.customer.lastName} in tenant ${isVehicleExists.tenant.tenantName}`
            })
        }

        const data = await prisma.vehicle.create({
            data: {
                chassisNumber: chassisNumber,
                color: color || null,
                currentOdometerReading: currentOdometerReading,
                customerId: Number(customerId),
                engineNumber: engineNumber,
                modelId: Number(modelId),
                variantId: Number(variantId),
                manufacturingYear: manufacturingYear || null,
                brandId: Number(brandId),
                purchaseDate: purchaseDate || null,
                registrationDate: registrationDate || null,
                tenantId: Number(tenantId),
                vehicleNumber: vehicleNumber,
                isActive: true
            }
        })
        return res.status(201).json({
            success: true,
            message: `Vehicle created with chassis number ${data.chassisNumber} and engine number ${data.engineNumber} `
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}



export const updateVehicle = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { vehicleId } = req.params;
    if (!vehicleId) {
        return res.status(403).json({
            success: false,
            message: 'Vehicle Id required'
        })
    }
    const { chassisNumber, color, currentOdometerReading, customerId, engineNumber, brandId, manufacturingYear, modelId, purchaseDate, registrationDate, variantId, vehicleNumber } = req.body;

    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }

    if (!modelId || !brandId || !engineNumber || !customerId || !currentOdometerReading || !chassisNumber || !variantId) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }

    try {
        const isVehicleExists = await prisma.vehicle.findUnique({
            where: {
                id: Number(vehicleId),
                tenantId: Number(tenantId)
            }
        })
        if (!isVehicleExists) {
            return res.status(403).json({
                success: false,
                message: `Vehicle not exists`
            })
        }

        const data = await prisma.vehicle.update({
            data: {
                chassisNumber: chassisNumber,
                color: color || null,
                currentOdometerReading: currentOdometerReading,
                customerId: Number(customerId),
                engineNumber: engineNumber,
                modelId: Number(modelId),
                variantId: Number(variantId),
                manufacturingYear: manufacturingYear || null,
                brandId: Number(brandId),
                purchaseDate: purchaseDate || null,
                registrationDate: registrationDate || null,
                tenantId: Number(tenantId),
                vehicleNumber: vehicleNumber,
            },
            where: {
                id: Number(vehicleId),
                tenantId: Number(tenantId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `vehicle with ${data.chassisNumber} updated successfully`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}


export const getVehicleDetails = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { vehicleId } = req.params;
    if (!vehicleId) {
        return res.status(403).json({
            success: false,
            message: 'Vehicle Id required'
        })
    }

    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }

    try {
        const isVehicleExists = await prisma.vehicle.findUnique({
            where: {
                id: Number(vehicleId),
                tenantId: Number(tenantId)
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                },
                customer: true,
                model : true,
                brand : true,
                variant : true
            }
        })
        if (!isVehicleExists) {
            return res.status(403).json({
                success: false,
                message: `Vehicle not exists`
            })
        }
        return res.status(201).json({
            success: true,
            data: isVehicleExists
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}

export const getListOfVehicle = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { skip, take } = req.query;

    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }

    try {
        const totalVehicles = await prisma.vehicle.count({
            where: {
                tenantId: Number(tenantId)
            }
        })
        let listOfVehicles
        if (skip || take) {
            listOfVehicles = await prisma.vehicle.findMany({
                skip: Number(skip),
                take: Number(take),
                where: {
                    tenantId: Number(tenantId)
                },
                include: {
                    customer: {
                        select: {
                            firstName: true,
                            lastName: true,
                            customerCode: true
                        }
                    },
                    tenant: {
                        select: {
                            tenantName: true
                        }
                    },
                    model : true,
                brand : true,
                variant : true
                }
            })
        } else {
            listOfVehicles = await prisma.vehicle.findMany({
                where: {
                    tenantId: Number(tenantId)
                },
                include: {
                    customer: {
                        select: {
                            firstName: true,
                            lastName: true,
                            customerCode: true
                        }
                    },
                    tenant: {
                        select: {
                            tenantName: true
                        }
                    },
                    model : true,
                brand : true,
                variant : true
                }
            })
        }
        return res.status(201).json({
            success: true,
            data: listOfVehicles,
            count: totalVehicles
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}


export const deactivateVehicle = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { vehicleId } = req.params;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    if (!vehicleId) {
        return res.status(404).json({
            success: false,
            message: "Vehicle id required",
        });
    }
    try {
        const isVehicleExists = await prisma.vehicle.findUnique({
            where: {
                id: Number(vehicleId),
                tenantId: Number(tenantId)
            }
        })
        if (!isVehicleExists) {
            return res.status(403).json({
                success: false,
                message: `Vehicle not exists`
            })
        }
        const data = await prisma.vehicle.update({
            where: { id: Number(vehicleId), tenantId: Number(tenantId) },
            data: {
                isActive: false,
            },
        });
        return res.status(200).json({
            success: true,
            message: `Vehicle with chassis number ${data.chassisNumber}  is deactivated`,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `server error : ${err}`
        });
    }
};

export const activateVehicle = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { vehicleId } = req.params;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    if (!vehicleId) {
        return res.status(404).json({
            success: false,
            message: "Vehicle id required",
        });
    }
    try {
        const isVehicleExists = await prisma.vehicle.findUnique({
            where: {
                id: Number(vehicleId),
                tenantId: Number(tenantId)
            }
        })
        if (!isVehicleExists) {
            return res.status(403).json({
                success: false,
                message: `Vehicle not exists`
            })
        }
        const data = await prisma.vehicle.update({
            where: { id: Number(vehicleId), tenantId: Number(tenantId) },
            data: {
                isActive: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: `Vehicle with chassis number ${data.chassisNumber}  is activated`,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `server error : ${err}`
        });
    }
};