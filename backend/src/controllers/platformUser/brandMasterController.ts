import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";

export const addBrand = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { brandCode, brandName } = req.body;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login'
        })
    }
    if (userType !== 'PLATFORM_USER') {
        return res.status(401).json({
            success: false,
            message: 'Platform User required'
        })
    }
    if (!brandCode || !brandName) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isBrandExits = await prisma.brandMaster.findUnique({
            where: { brandCode: brandCode },
            select: {
                brandName: true
            }
        })
        if (isBrandExits) {
            return res.status(500).json({
                success: false,
                message: `Brand already exists with name ${brandName}`
            })
        }
        const data = await prisma.brandMaster.create({
            data: {
                brandCode: brandCode,
                brandName: brandName
            }
        })
        return res.status(201).json({
            success: true,
            message: `Brand ${data.brandName} is Created`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const updateBrand = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { brandId } = req.params;
    const { brandCode, brandName } = req.body;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login'
        })
    }
    if (userType !== 'PLATFORM_USER') {
        return res.status(401).json({
            success: false,
            message: 'Platform User required'
        })
    }
    if (!brandId) {
        return res.status(403).json({
            success: false,
            message: 'Brand id is required'
        })
    }
    if (!brandCode || !brandName) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isBrandExits = await prisma.brandMaster.findUnique({
            where: { brandCode: brandCode },
            select: {
                brandName: true
            }
        })
        if (!isBrandExits) {
            return res.status(500).json({
                success: false,
                message: `Brand not exists with name ${brandName}`
            })
        }
        const data = await prisma.brandMaster.update({
            data: {
                brandCode: brandCode,
                brandName: brandName
            },
            where: {
                id: Number(brandId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `Brand ${data.brandName} is updated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const getBrandDetails = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { brandId } = req.params;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login'
        })
    }
    if (userType !== 'PLATFORM_USER') {
        return res.status(401).json({
            success: false,
            message: 'Platform User required'
        })
    }
    if (!brandId) {
        return res.status(403).json({
            success: false,
            message: 'Brand id is required'
        })
    }
    try {
        const isBrandExists = await prisma.brandMaster.findUnique({
            where: { id: Number(brandId) },
        })
        if (!isBrandExists) {
            return res.status(500).json({
                success: false,
                message: `Brand not exists`
            })
        }
        return res.status(201).json({
            success: true,
            data: isBrandExists
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const getListOfBrands = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { skip, take } = req.query;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login'
        })
    }
    try {
        const totalBrands = await prisma.brandMaster.count()
        let listOfBrands
        if (skip || take) {
            listOfBrands = await prisma.brandMaster.findMany({
                skip: Number(skip),
                take: Number(take)
            })
        }
        listOfBrands = await prisma.brandMaster.findMany()
        return res.status(201).json({
            success: true,
            data: listOfBrands,
            count: totalBrands
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}


export const deactivateBrand = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { brandId } = req.params;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login'
        })
    }
    if (userType !== 'PLATFORM_USER') {
        return res.status(401).json({
            success: false,
            message: 'Platform User required'
        })
    }
    if (!brandId) {
        return res.status(403).json({
            success: false,
            message: 'Brand id is required'
        })
    }
    try {
        const isBrandExits = await prisma.brandMaster.findUnique({
            where: { id: Number(brandId) },
            select: {
                brandName: true
            }
        })
        if (!isBrandExits) {
            return res.status(500).json({
                success: false,
                message: `Brand not exists`
            })
        }
        const data = await prisma.brandMaster.update({
            data: {
                isActive: false
            },
            where: {
                id: Number(brandId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `Brand ${data.brandName} is deactivated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const activateBrand = async (req: Request, res: Response) => {
    const { id, userType } = req.user!;
    const { brandId } = req.params;
    if (!id) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized login'
        })
    }
    if (userType !== 'PLATFORM_USER') {
        return res.status(401).json({
            success: false,
            message: 'Platform User required'
        })
    }
    if (!brandId) {
        return res.status(403).json({
            success: false,
            message: 'Brand id is required'
        })
    }
    try {
        const isBrandExits = await prisma.brandMaster.findUnique({
            where: { id: Number(brandId) },
            select: {
                brandName: true
            }
        })
        if (!isBrandExits) {
            return res.status(500).json({
                success: false,
                message: `Brand not exists`
            })
        }
        const data = await prisma.brandMaster.update({
            data: {
                isActive: true
            },
            where: {
                id: Number(brandId)
            }
        })
        return res.status(201).json({
            success: true,
            message: `Brand ${data.brandName} is activated`
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}