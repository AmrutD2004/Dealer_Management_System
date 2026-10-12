import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";

export const createCustomer = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { email, firstName, middleName, lastName, title, address1, address2, state, pincode, partDiscountPercent, labourDiscountPercent, mobileNo, alternateMobileNo, dateOfBirth, country, city } = req.body;

    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }

    if (!mobileNo || !partDiscountPercent || !lastName || !labourDiscountPercent || !firstName || !address1) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }

    try {
        const isCustomerExists = await prisma.customer.findFirst({
            where: {
                mobileNo: mobileNo,
                tenantId: Number(tenantId)
            }
        })
        if (isCustomerExists) {
            return res.status(403).json({
                success: false,
                message: `Customer already exists with ${isCustomerExists.mobileNo} mobile number`
            })
        }
        const getTenant = await prisma.tenant.findUnique({
            where: {
                id: Number(tenantId)
            },
            select: {
                tenantName: true
            }
        })
        if (!getTenant) {
            return res.status(403).json({
                success: false,
                message: 'Customer cant be created'
            })
        }
        const lastTenantCustomer = await prisma.customer.findFirst({
            where: {
                tenantId: Number(tenantId),
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                }
            },
            orderBy: {
                id: "desc",
            },
        });

        let customerNextNumber = 1;

        if (lastTenantCustomer) {
            const codePart = lastTenantCustomer.customerCode.split("-")[1];

            if (codePart) {
                const numericPart = codePart.slice(-4);
                customerNextNumber = parseInt(numericPart, 10) + 1;
            }
        }

        const first2Character = getTenant?.tenantName
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((word: string) => word[0])
            .join('')
            .toUpperCase();

        const customerCode = `CUST-${first2Character}${String(customerNextNumber).padStart(4, "0")}`;

        const data = await prisma.customer.create({
            data: {
                customerCode: customerCode,
                email: email || null,
                firstName: firstName,
                middleName: middleName || null,
                lastName: lastName,
                address1: address1,
                address2: address2 || null,
                mobileNo: mobileNo,
                alternateMobileNo: alternateMobileNo || null,
                city: city || null,
                country: country || null,
                state: state || null,
                dateOfBirth: dateOfBirth || null,
                pincode: pincode || null,
                laborDiscountPercent: parseFloat(labourDiscountPercent),
                partDiscountPercent: parseFloat(partDiscountPercent),
                authorizedBy: Number(id),
                tenantId: Number(tenantId),
                title: title,
                isActive: true
            }
        })
        return res.status(201).json({
            success: true,
            message: `${data.firstName} ${data.lastName} customer added successfully`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}



export const updateCustomer = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { custId } = req.params;
    if (!custId) {
        return res.status(403).json({
            success: false,
            message: 'Customer Id required'
        })
    }
    const { email, firstName, middleName, lastName, title, address1, address2, state, pincode, partDiscountPercent, labourDiscountPercent, mobileNo, alternateMobileNo, dateOfBirth, country, city } = req.body;

    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }

    if (!mobileNo || !partDiscountPercent || !lastName || !labourDiscountPercent || !firstName || !address1 || !title) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }

    try {
        const isCustomerExists = await prisma.customer.findUnique({
            where: {
                id: Number(custId),
                tenantId: Number(tenantId)
            }
        })
        if (!isCustomerExists) {
            return res.status(403).json({
                success: false,
                message: `Customer not exists`
            })
        }

        const data = await prisma.customer.update({
            data: {
                email: email || null,
                firstName: firstName,
                middleName: middleName || null,
                lastName: lastName,
                address1: address1,
                address2: address2 || null,
                mobileNo: mobileNo,
                alternateMobileNo: alternateMobileNo || null,
                city: city || null,
                country: country || null,
                state: state || null,
                dateOfBirth: dateOfBirth || null,
                pincode: pincode || null,
                laborDiscountPercent: parseFloat(labourDiscountPercent),
                partDiscountPercent: parseFloat(partDiscountPercent),
                authorizedBy: Number(id),
                tenantId: Number(tenantId),
                title: title
            },
            where: {
                id: Number(custId),
                tenantId: Number(tenantId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `${data.firstName} ${data.lastName} customer updated successfully`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}


export const getCustomerDetails = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { custId } = req.params;
    if (!custId) {
        return res.status(403).json({
            success: false,
            message: 'Customer Id required'
        })
    }

    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }

    try {
        const isCustomerExists = await prisma.customer.findUnique({
            where: {
                id: Number(custId),
                tenantId: Number(tenantId)
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                },
                authorizedByUser: {
                    select: {
                        firstName: true,
                        lastName: true,
                        mobileNo: true,
                        designation: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })
        if (!isCustomerExists) {
            return res.status(403).json({
                success: false,
                message: `Customer not exists`
            })
        }
        return res.status(201).json({
            success: true,
            data: isCustomerExists
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}

export const getCustomerList = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { skip, take } = req.query;

    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: 'Not authorized login again'
        })
    }

    try {
        const totalCustomers = await prisma.customer.count({
            where: {
                tenantId: Number(tenantId)
            }
        })
        let listOfCutomers
        if (skip || take) {
            listOfCutomers = await prisma.customer.findMany({
                skip: Number(skip),
                take: Number(take),
                where: {
                    tenantId: Number(tenantId)
                },
                include: {
                    authorizedByUser: {
                        select: {
                            firstName: true,
                            lastName: true,
                            mobileNo: true,
                            designation: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            })
        } else {
            listOfCutomers = await prisma.customer.findMany({
                where: {
                    tenantId: Number(tenantId)
                },
                include: {
                    authorizedByUser: {
                        select: {
                            firstName: true,
                            lastName: true,
                            mobileNo: true,
                            designation: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                }
            })
        }
        return res.status(201).json({
            success: true,
            data: listOfCutomers,
            count: totalCustomers
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        });
    }

}


export const deactivateCustomer = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { custId } = req.params;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    if (!custId) {
        return res.status(404).json({
            success: false,
            message: "Customer id required",
        });
    }
    try {
        const isCustomerExists = await prisma.customer.findUnique({
            where: {
                id: Number(custId),
                tenantId: Number(tenantId)
            }
        })
        if (!isCustomerExists) {
            return res.status(403).json({
                success: false,
                message: `Customer not exists`
            })
        }
        const data = await prisma.customer.update({
            where: { id: Number(custId), tenantId: Number(tenantId) },
            data: {
                isActive: false,
            },
        });
        return res.status(200).json({
            success: true,
            message: `${data.firstName} ${data.lastName} customer is deactivated`,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `server error : ${err}`
        });
    }
};

export const activateCustomer = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { custId } = req.params;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }
    if (!custId) {
        return res.status(404).json({
            success: false,
            message: "Customer id required",
        });
    }
    try {
        const isCustomerExists = await prisma.customer.findUnique({
            where: {
                id: Number(custId),
                tenantId: Number(tenantId)
            }
        })
        if (!isCustomerExists) {
            return res.status(403).json({
                success: false,
                message: `Customer not exists`
            })
        }
        const data = await prisma.customer.update({
            where: { id: Number(custId), tenantId: Number(tenantId) },
            data: {
                isActive: true,
            },
        });
        return res.status(200).json({
            success: true,
            message: `${data.firstName} ${data.lastName} customer is activated`,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `server error : ${err}`
        });
    }
};