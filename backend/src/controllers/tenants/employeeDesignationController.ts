import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";
import { count } from "console";

export const createEmployeeDesignation = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    const { code, name, description, isMechanic } = req.body
    if (!code || !name || !description) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        //Checking is designation is exist in tenant 
        const checkIsDesignationExists = await prisma.employeeDesignation.findFirst({
            where: {
                code: code,
                tenantId: tenantId
            }
        })
        if (checkIsDesignationExists) {
            return res.status(409).json({
                success: false,
                message: `Designation ${name} having code ${code} is already exists.`
            })
        }
        const data = await prisma.employeeDesignation.create({
            data: {
                tenantId: Number(tenantId),
                code: code,
                name: name,
                description: description,
                isMechanic: isMechanic,
                isActive: true
            }
        })
        return res.status(201).json({
            success: true,
            message: `Designation ${data.name} with code ${data.code} is created`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        })
    }
}


export const getAllEmployeeDesignation = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { skip, take } = req.query;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        const totalDesignations = await prisma.employeeDesignation.count({
            where: {
                tenantId: Number(tenantId)
            }
        })
        let tenantDesignations
        if (skip || take) {
            tenantDesignations = await prisma.employeeDesignation.findMany({
                skip: Number(skip),
                take: Number(take),
                where: {
                    tenantId: Number(tenantId)
                }
            })
        } else {
            tenantDesignations = await prisma.employeeDesignation.findMany({
                where: {
                    tenantId: Number(tenantId)
                }
            })
        }

        return res.status(200).json({
            success: true,
            data: tenantDesignations,
            count: totalDesignations
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        })
    }
}

export const getEmployeeDesignationDetails = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { designationId } = req.params;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!designationId) {
        return res.status(404).json({
            success: false,
            message: 'designation id required'
        })
    }
    try {
        const isDesignationExists = await prisma.employeeDesignation.findUnique({
            where: {
                id: Number(designationId),
                tenantId: Number(tenantId)
            }
        })
        if (!isDesignationExists) {
            return res.status(404).json({
                success: false,
                message: 'Designation not exists'
            })
        }
        return res.status(302).json({
            success: true,
            data: isDesignationExists
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        })
    }
}

export const updateDesignation = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { designationId } = req.params;
    const { code, name, description, isMechanic } = req.body
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!designationId) {
        return res.status(404).json({
            success: false,
            message: 'designation id required'
        })
    }
    if (!code || !name || !description) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isDesignationExists = await prisma.employeeDesignation.findUnique({
            where: {
                id: Number(designationId),
                tenantId: Number(tenantId)
            }
        })
        if (!isDesignationExists) {
            return res.status(404).json({
                success: false,
                message: 'Designation not exists'
            })
        }
        const data = await prisma.employeeDesignation.update({
            data: {
                code: code,
                name: name,
                description: description,
                isMechanic: isMechanic
            },
            where: {
                id: Number(designationId),
                tenantId: Number(tenantId)
            }
        })

        return res.status(200).json({
            success: true,
            message: `${data.name} details are updated`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        })
    }
}


export const deactivateTenantDesignation = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { designationId } = req.params;
    if (!designationId) {
        return res.status(404).json({
            success: false,
            message: 'designation id required'
        })
    }
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        const isDesignationExists = await prisma.employeeDesignation.findUnique({
            where: {
                id: Number(designationId),
                tenantId: Number(tenantId)
            },
            include: {
                tenant: true
            }
        })
        if (!isDesignationExists) {
            return res.status(404).json({
                success: false,
                message: 'Designation not exists'
            })
        }
        const data = await prisma.employeeDesignation.update({
            data: {
                isActive: false
            },
            where: { id: Number(designationId), tenantId: Number(tenantId) }
        })
        return res.status(200).json({
            success: true,
            message: `Designation ${data.name} of tenant ${isDesignationExists.tenant.tenantName} is deactivated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }

}

export const activateTenantDesignation = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { designationId } = req.params;
    if (!designationId) {
        return res.status(404).json({
            success: false,
            message: 'designation id required'
        })
    }
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        const isDesignationExists = await prisma.employeeDesignation.findUnique({
            where: {
                id: Number(designationId),
                tenantId: Number(tenantId)
            },
            include: {
                tenant: true
            }
        })
        if (!isDesignationExists) {
            return res.status(404).json({
                success: false,
                message: 'Designation not exists'
            })
        }
        const data = await prisma.employeeDesignation.update({
            data: {
                isActive: true
            },
            where: { id: Number(designationId), tenantId: Number(tenantId) }
        })
        return res.status(200).json({
            success: true,
            message: `Designation ${data.name} of tenant ${isDesignationExists.tenant.tenantName} is activated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }

}

export const mechanicAssign = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { designationId } = req.params;
    if (!designationId) {
        return res.status(404).json({
            success: false,
            message: 'designation id required'
        })
    }
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        const isDesignationExists = await prisma.employeeDesignation.findUnique({
            where: {
                id: Number(designationId),
                tenantId: Number(tenantId)
            },
            include: {
                tenant: true
            }
        })
        if (!isDesignationExists) {
            return res.status(404).json({
                success: false,
                message: 'Designation not exists'
            })
        }
        const data = await prisma.employeeDesignation.update({
            data: {
                isMechanic: true
            },
            where: { id: Number(designationId), tenantId: Number(tenantId) }
        })
        return res.status(200).json({
            success: true,
            message: `Designation ${data.name} of tenant ${isDesignationExists.tenant.tenantName} is mechanic now`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }

}

export const mechanicUnassign = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { designationId } = req.params;
    if (!designationId) {
        return res.status(404).json({
            success: false,
            message: 'designation id required'
        })
    }
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        const isDesignationExists = await prisma.employeeDesignation.findUnique({
            where: {
                id: Number(designationId),
                tenantId: Number(tenantId)
            },
            include: {
                tenant: true
            }
        })
        if (!isDesignationExists) {
            return res.status(404).json({
                success: false,
                message: 'Designation not exists'
            })
        }
        const data = await prisma.employeeDesignation.update({
            data: {
                isMechanic: false
            },
            where: { id: Number(designationId), tenantId: Number(tenantId) }
        })
        return res.status(200).json({
            success: true,
            message: `Designation ${data.name} of tenant ${isDesignationExists.tenant.tenantName} is not a mechanic now`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }

}