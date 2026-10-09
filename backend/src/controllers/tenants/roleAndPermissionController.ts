import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";


//Role Management
export const createRole = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    const { roleCode, roleName, roleDescription } = req.body
    if (!roleCode || !roleName || !roleDescription) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isRoleExists = await prisma.role.findFirst({
            where: {
                roleCode: roleCode,
                roleName: roleName
            }
        })
        if(isRoleExists){
            return res.status(302).json({
                success : false,
                message : `Role ${isRoleExists.roleCode} is already exists`
            })
        }
        const data = await prisma.role.create({
            data: {
                tenantId: Number(tenantId),
                roleCode: roleCode,
                roleName: roleName,
                roleDescription: roleDescription,
                isActive: true,
                isSystemRole: false
            }
        })
        return res.status(201).json({
            success: true,
            message: `${data.roleName} is created`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        })
    }
}

export const getAllTenantRole = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { skip, take } = req.query;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        const totalRoles = await prisma.role.count({
            where: {
                tenantId: Number(tenantId)
            }
        })
        const tenantRoles = await prisma.role.findMany({
            skip: Number(skip),
            take: Number(take),
            where: {
                tenantId: Number(tenantId)
            }
        })

        return res.status(200).json({
            success: true,
            data: tenantRoles,
            count: totalRoles
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        })
    }
}

export const getRoleDetails = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { roleId } = req.params;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!roleId) {
        return res.status(404).json({
            success: false,
            message: 'role id required'
        })
    }
    try {
        const isRoleExists = await prisma.role.findUnique({
            where: {
                id: Number(roleId),
                tenantId: Number(tenantId)
            }
        })
        if (!isRoleExists) {
            return res.status(404).json({
                success: false,
                message: 'role not exists'
            })
        }
        return res.status(302).json({
            success: true,
            data: isRoleExists
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        })
    }
}

export const updateRole = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { roleId } = req.params;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!roleId) {
        return res.status(404).json({
            success: false,
            message: 'role id is required'
        })
    }
    const { roleCode, roleName, roleDescription } = req.body
    if (!roleCode || !roleName || !roleDescription) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isRoleExists = await prisma.role.findUnique({
            where: {
                id: Number(roleId),
                tenantId: Number(tenantId)
            }
        })
        if (!isRoleExists) {
            return res.status(404).json({
                success: false,
                message: 'role not exists'
            })
        }
        const data = await prisma.role.update({
            data: {
                roleCode: roleCode,
                roleName: roleName,
                roleDescription: roleDescription,
            },
            where: {
                tenantId: Number(tenantId),
                id: Number(roleId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `${data.roleName} is updated`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${err}`
        })
    }
}


export const deactivateTenantRole = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { roleId } = req.params;
    if (!roleId) {
        return res.status(404).json({
            success: false,
            message: 'role id required'
        })
    }
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        const isRoleExists = await prisma.role.findUnique({
            where: {
                id: Number(roleId),
                tenantId: Number(tenantId)
            },
            include: {
                tenant: true
            }
        })
        if (!isRoleExists) {
            return res.status(404).json({
                success: false,
                message: 'role not exists'
            })
        }
        const data = await prisma.role.update({
            data: {
                isActive: false
            },
            where: { id: Number(roleId), tenantId: Number(tenantId) }
        })
        return res.status(200).json({
            success: true,
            message: `Role ${data.roleName} of tenant ${isRoleExists.tenant.tenantName} is deactivated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }

}

export const activateTenantRole = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { roleId } = req.params;
    if (!roleId) {
        return res.status(404).json({
            success: false,
            message: 'role id required'
        })
    }
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        const isRoleExists = await prisma.role.findUnique({
            where: {
                id: Number(roleId),
                tenantId: Number(tenantId)
            },
            include: {
                tenant: true
            }
        })
        if (!isRoleExists) {
            return res.status(404).json({
                success: false,
                message: 'role not exists'
            })
        }
        const data = await prisma.role.update({
            data: {
                isActive: true
            },
            where: { id: Number(roleId), tenantId: Number(tenantId) }
        })
        return res.status(200).json({
            success: true,
            message: `Role ${data.roleName} of tenant ${isRoleExists.tenant.tenantName} is activated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }

}



export const assigningRoleToPermission = async(req : Request, res : Response)=>{
    const { id, tenantId } = req.user!
    const { roleId, permissionId } = req.params;
    if (!roleId || !permissionId) {
        return res.status(404).json({
            success: false,
            message: 'role and permission id required'
        })
    }
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try{
        const data = await prisma.rolePermissionMapping.create({
            data : {
                roleId : Number(roleId),
                permissionId : Number(roleId)
            },
            include : {
                role : true,
                permission : true
            }
        })
        return res.status(201).json({
            success : true,
            message : `${data.permission.permissionName} is assign to role ${data.role.roleName}`
        })
    }catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error : ${error}`
        })
    }
}


