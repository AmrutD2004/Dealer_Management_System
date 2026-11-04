import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";
import { UploadedFile } from "express-fileupload";
import * as XLSX from 'xlsx'
import { Prisma } from "../../generated/prisma/client";

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
                tenant: {
                    connect: {
                        id: Number(tenantId),
                    }
                },
                labourCode: labourCode,
                labourName: labourName,
                labourDescription: labourDescription || null,
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


export const createLabourWithExcel = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const labourFile = req.files?.file as UploadedFile | null;
    if (!id || !tenantId) {
        return res.status(404).json({
            success: false,
            message: "Not Authorized login again",
        });
    }

    try {
        const readedFile = XLSX.read(labourFile?.data, { type: 'buffer' })
        const sheetName = readedFile.SheetNames[0]
        const sheet = readedFile.Sheets[sheetName]
        const sheetData = XLSX.utils.sheet_to_json(sheet)

        const labourCodes = sheetData.map((l: any) => l['Labour_Code'].trim())

        const isLabourExists = await prisma.labourMaster.findMany({
            where: {
                tenantId: Number(tenantId),
                labourCode: {
                    in: labourCodes
                }
            }
        })
        const existingCodes = isLabourExists.map((l: any) => l.labourCode)
        if (isLabourExists.length > 0) {
            return res.status(403).json({
                success: true,
                message: 'Some labours already exists in master.',
                existingLabour: existingCodes
            })
        }
        const data = await prisma.labourMaster.createMany({
            data: sheetData.map((labour: any) => ({
                tenantId: Number(tenantId),
                labourCode: labour.Labour_Code,
                labourName: labour.Labour_Name,
                labourDescription: labour.Labour_Description ? labour.Labour_Description : '',
                rate: parseFloat(labour.Rate),
                standardHours: new Prisma.Decimal(labour.Standard_Hours),
                isActive: Boolean(labour.Is_Active)
            }))
        })
        return res.status(201).json({
            success: true,
            message: 'Labour data inserted'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}