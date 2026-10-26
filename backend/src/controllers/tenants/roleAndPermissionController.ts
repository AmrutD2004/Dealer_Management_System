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
        if (isRoleExists) {
            return res.status(302).json({
                success: false,
                message: `Role ${isRoleExists.roleCode} is already exists`
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
        let tenantRoles
        if (skip || take) {
            tenantRoles = await prisma.role.findMany({
                skip: Number(skip) || 0,
                take: Number(take) || 0,
                where: {
                    tenantId: Number(tenantId)
                }
            })
        }
        else {
            tenantRoles = await prisma.role.findMany({
                where: {
                    tenantId: Number(tenantId)
                }
            })
        }


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




export const assigningPermissionToRole = async (
    req: Request,
    res: Response
) => {
    const { id, tenantId } = req.user!;
    const { roleId, permissionIds } = req.body;

    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: "Not authorized. Please log in again.",
        });
    }

    if (
        !roleId ||
        !Array.isArray(permissionIds) ||
        permissionIds.length === 0
    ) {
        return res.status(400).json({
            success: false,
            message: "Role ID and permission IDs are required.",
        });
    }

    const parsedRoleId = Number(roleId);
    const parsedPermissionIds = permissionIds.map(Number);

    if (
        !Number.isInteger(parsedRoleId) ||
        parsedRoleId <= 0 ||
        parsedPermissionIds.some(
            (permissionId: number) =>
                !Number.isInteger(permissionId) || permissionId <= 0
        )
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid role ID or permission IDs.",
        });
    }

    const uniquePermissionIds = [...new Set(parsedPermissionIds)];

    try {
        // Check whether the role exists.
        const role = await prisma.role.findFirst({
            where: {
                id: parsedRoleId,
                tenantId: Number(tenantId),
            },
        });

        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found.",
            });
        }

        // Validate that all permission IDs exist.
        const permissions = await prisma.permission.findMany({
            where: {
                id: { in: uniquePermissionIds },
            },
        });

        if (permissions.length !== uniquePermissionIds.length) {
            return res.status(400).json({
                success: false,
                message: "One or more permission IDs are invalid.",
            });
        }

        // Find permissions already assigned to this role.
        const existingMappings =
            await prisma.rolePermissionMapping.findMany({
                where: {
                    roleId: parsedRoleId,
                    permissionId: { in: uniquePermissionIds },
                },
                select: {
                    permissionId: true,
                },
            });

        const existingPermissionIds = new Set(
            existingMappings.map((mapping) => mapping.permissionId)
        );

        const newPermissionIds = uniquePermissionIds.filter(
            (permissionId) => !existingPermissionIds.has(permissionId)
        );

        if (newPermissionIds.length === 0) {
            return res.status(409).json({
                success: false,
                message: "All selected permissions are already assigned.",
            });
        }

        // Insert one row per permission ID.
        const result = await prisma.rolePermissionMapping.createMany({
            data: newPermissionIds.map((permissionId) => ({
                roleId: Number(parsedRoleId),
                permissionId : Number(permissionId)
            })),
        });

        return res.status(201).json({
            success: true,
            message: `${result.count} permission(s) assigned to ${role.roleName}.`,
            data: {
                roleId: parsedRoleId,
                permissionIds: newPermissionIds,
            },
        });
    } catch (error) {
        console.error("Assign permission error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};



export const updatePermissionToRole = async (
    req: Request,
    res: Response
) => {
    const { id, tenantId } = req.user!;
    const { rolePermissionId } = req.params;
    const { roleId, permissionId } = req.body;

    if (!roleId || !permissionId) {
        return res.status(400).json({
            success: false,
            message: "Role and permission ID are required",
        });
    }

    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: "Not authorized. Login again",
        });
    }

    try {
        // Verify that the role belongs to the logged-in tenant
        const role = await prisma.role.findFirst({
            where: {
                id: Number(roleId),
                tenantId: Number(tenantId),
            },
        });

        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found for this tenant",
            });
        }

        // Update the mapping and retrieve tenant details
        const data = await prisma.rolePermissionMapping.update({
            data: {
                roleId: Number(roleId),
                permissionId: Number(permissionId)
            },
            where: {
                id: Number(rolePermissionId)
            },
            include: {
                role: {
                    include: {
                        tenant: true
                    }
                },
                permission: true
            }
        });

        return res.status(200).json({
            success: true,
            message: `${data.permission.permissionName} permission assigned to role ${data.role.roleName}`,
            data
        });
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getListOfPermissionToRole = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { skip, take } = req.query;

    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: "Not authorized. Login again",
        });
    }
    try {
        const totalPermissions = await prisma.rolePermissionMapping.count({
            where: {
                role: {
                    tenantId: Number(tenantId)
                }
            }
        })
        const listOfPermissionToRole = await prisma.rolePermissionMapping.findMany({
            skip: Number(skip) || 0,
            take: Number(take) || 5,
            where: {
                role: {
                    tenantId: Number(tenantId)
                }
            },
            include: {
                role: true,
                permission: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return res.status(200).json({
            success: true,
            data: listOfPermissionToRole,
            count: totalPermissions
        })
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }

}



export const getDetailsPermissionToRole = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!;
    const { rolePermissionId } = req.params;



    if (!rolePermissionId) {
        return res.status(400).json({
            success: false,
            message: "ID are required",
        });
    }

    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: "Not authorized. Login again",
        });
    }
    try {

        const permissionToRoleDetails = await prisma.rolePermissionMapping.findUnique({
            where: {
                id: Number(rolePermissionId)
            },
            include: {
                role: {
                    include: {
                        tenant: true
                    }
                },
                permission: true
            }
        })
        return res.status(200).json({
            success: true,
            data: permissionToRoleDetails
        })
    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }

}







