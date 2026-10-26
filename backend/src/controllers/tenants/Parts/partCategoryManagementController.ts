import { Request, Response } from "express";
import { prisma } from "../../../prisma/lib/prisma";

export const addPartCategory = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { code, name, parentId } = req.body;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!code || !name) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isCategoryExists = await prisma.partCategoryMaster.findUnique({
            where: {
                tenantId_code: {
                    tenantId: Number(tenantId),
                    code: code
                }
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                }
            }
        })
        if (isCategoryExists) {
            return res.status(403).json({
                success: false,
                message: `Part category already exists with code ${code} in ${isCategoryExists.tenant.tenantName}`
            })
        }
        const data = await prisma.partCategoryMaster.create({
            data: {
                code: code,
                name: name,
                parentId: parentId || null,
                tenantId: Number(tenantId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `${data.name} part category is created`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}

export const updatePartCategory = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { categoryId } = req.params;
    const { code, name, parentId } = req.body;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!categoryId) {
        return res.status(400).json({
            success: false,
            message: 'Category Id ie required'
        })
    }
    if (!code || !name) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isCategoryExists = await prisma.partCategoryMaster.findUnique({
            where: {
                id: Number(categoryId)
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                }
            }
        })
        if (!isCategoryExists) {
            return res.status(403).json({
                success: false,
                message: `category not exists with code ${code}.`
            })
        }
        const data = await prisma.partCategoryMaster.update({
            data: {
                code: code,
                name: name,
                parentId: parentId || null,
            },
            where: {
                id: Number(categoryId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `${data.name} part category is updated`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}

export const getListOfPartCategories = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { skip, take } = req.query;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    try {
        const totalPartCategory = await prisma.partCategoryMaster.count({
                where: {
                    tenantId: Number(tenantId)
                }
            })
        let listOfPartCategory
        if (skip || take) {
            listOfPartCategory = await prisma.partCategoryMaster.findMany({
                skip: Number(skip),
                take: Number(take),
                where: {
                    tenantId: Number(tenantId)
                },
                include : {
                    tenant  : {
                        select : {
                            tenantName : true,
                        }
                    },
                    parent : true
                }
            })
        }
        listOfPartCategory = await prisma.partCategoryMaster.findMany({
                where: {
                    tenantId: Number(tenantId)
                },
                include : {
                    tenant  : {
                        select : {
                            tenantName : true,
                        }
                    },
                    parent : true
                }
            })

        return res.status(201).json({
            success: true,
            data: listOfPartCategory,
            count : totalPartCategory
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}

export const getPartCategoryDetails = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { categoryId } = req.params;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!categoryId) {
        return res.status(400).json({
            success: false,
            message: 'Category Id ie required'
        })
    }
    try {
        const isCategoryExists = await prisma.partCategoryMaster.findUnique({
            where: {
                id: Number(categoryId)
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                },
                parent : true
            }
        })
        if (!isCategoryExists) {
            return res.status(403).json({
                success: false,
                message: `category not exists.`
            })
        }
        return res.status(201).json({
            success: true,
            data: isCategoryExists
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}

export const deactivatePartCategory = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { categoryId } = req.params;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!categoryId) {
        return res.status(400).json({
            success: false,
            message: 'Category Id ie required'
        })
    }
    try {
        const isCategoryExists = await prisma.partCategoryMaster.findUnique({
            where: {
                id: Number(categoryId)
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                }
            }
        })
        if (!isCategoryExists) {
            return res.status(403).json({
                success: false,
                message: `category not exists.`
            })
        }
        const data = await prisma.partCategoryMaster.update({
            data: {
               isActive : false
            },
            where: {
                id: Number(categoryId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `${data.name} part category is deactivated`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}

export const activatePartCategory = async (req: Request, res: Response) => {
    const { id, tenantId } = req.user!
    const { categoryId } = req.params;
    if (!id || !tenantId) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    if (!categoryId) {
        return res.status(400).json({
            success: false,
            message: 'Category Id ie required'
        })
    }
    try {
        const isCategoryExists = await prisma.partCategoryMaster.findUnique({
            where: {
                id: Number(categoryId)
            },
            include: {
                tenant: {
                    select: {
                        tenantName: true
                    }
                }
            }
        })
        if (!isCategoryExists) {
            return res.status(403).json({
                success: false,
                message: `category not exists.`
            })
        }
        const data = await prisma.partCategoryMaster.update({
            data: {
               isActive : true
            },
            where: {
                id: Number(categoryId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `${data.name} part category is activated`
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server error ${err}`
        })
    }
}
