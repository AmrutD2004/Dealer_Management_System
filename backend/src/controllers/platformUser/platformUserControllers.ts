import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";
import bcrypt from 'bcrypt'

export const addPlatformUsers = async (req: Request, res: Response) => {
    const { id, role, userType } = req.user!;
    const { email, passwordHash, userRole } = req.body;
    if (!id && !role && !userType) {
        return res.status(401).json({
            success: false,
            message: 'Not Authorized'
        })
    }
    if (role !== 'SUPER_ADMIN' && userType !== 'PLATFORM_USER') {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to perform operation'
        })
    }
    if (!email || !passwordHash) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    try {
        const isUserExist = await prisma.platformUser.findFirst({
            where: { email: email }
        })
        if (isUserExist) {
            return res.status(404).json({
                success: false,
                message: 'User already exists'
            })
        }
        const hashedPassword = await bcrypt.hash(passwordHash, 10)
        const data = await prisma.platformUser.create({
            data: {
                email: email,
                passwordHash: hashedPassword,
                role: userRole
            }
        })
        return res.status(201).json({
            success: true,
            message: 'User Created'
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}


export const editPlatformUser = async (req: Request, res: Response) => {
    const { id, role, userType } = req.user!;
    const { userId } = req.params;
    const { email, passwordHash, userRole } = req.body;
    if (!id && !role) {
        return res.status(401).json({
            success: false,
            message: 'Not Authorized'
        })
    }
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Id required'
        })
    }
    if (role !== 'SUPER_ADMIN' && userType !== 'PLATFORM_USER') {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to perform operation'
        })
    }
    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required'
        })
    } try {
        const data = await prisma.platformUser.update({
            data: {
                email: email,
                ...(passwordHash ? { passwordHash: await bcrypt.hash(passwordHash, 10) } : {}),
                role: userRole
            },
            where: { id: Number(userId) }
        })
        return res.status(201).json({
            success: true,
            message: 'Data Updated'
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}



export const deactivatePlatformUser = async (req: Request, res: Response) => {
    const { id, role, userType } = req.user!;
    const { userId } = req.params;
    if (!id && !role && !userType) {
        return res.status(401).json({
            success: false,
            message: 'Not Authorized'
        })
    }
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Id required'
        })
    }
    if (role !== 'SUPER_ADMIN' && userType !== 'PLATFORM_USER') {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to perform operation'
        })
    }
    if (Number(userId) === id) {
        return res.status(400).json({
            success: false,
            message: 'You cannot delete your own account'
        })
    }
    try {
        const isUserExist = await prisma.platformUser.findUnique({
            where: { id: Number(userId) },
        })
        if (!isUserExist) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        await prisma.platformUser.update({
            data: {
                isActive: false
            },
            where: { id: Number(userId) }
        })
        return res.status(200).json({
            success: true,
            message: 'User deactivated'
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}

export const activatePlatformUser = async (req: Request, res: Response) => {
    const { id, role, userType } = req.user!;
    const { userId } = req.params;
    if (!id && !role && !userType) {
        return res.status(401).json({
            success: false,
            message: 'Not Authorized'
        })
    }
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Id required'
        })
    }
    if (role !== 'SUPER_ADMIN' && userType !== 'PLATFORM_USER') {
        return res.status(401).json({
            success: false,
            message: 'Not authorized to perform operation'
        })
    }
    if (Number(userId) === id) {
        return res.status(400).json({
            success: false,
            message: 'You cannot delete your own account'
        })
    }
    try {
        const isUserExist = await prisma.platformUser.findUnique({
            where: { id: Number(userId) },
        })
        if (!isUserExist) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }
        await prisma.platformUser.update({
            data: {
                isActive: true
            },
            where: { id: Number(userId) }
        })
        return res.status(200).json({
            success: true,
            message: 'User Activated'
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}




export const getListOfPlatformUsers = async (req: Request, res: Response) => {
    const { id, role, userType } = req.user!;
    const { skip, take } = req.query;
    if (!id && !role && !userType) {
        return res.status(401).json({
            success: false,
            message: 'Not Authorized'
        })
    }
    try {
        const totalPlatformUsersCount = await prisma.platformUser.count()
        const activeUserCount = await prisma.platformUser.count({
            where : {
                isActive : true
            }
        })
        const platformUsersList = await prisma.platformUser.findMany({
            skip: Number(skip),
            take: Number(take),
            orderBy: {
                createdAt: 'desc'
            }
        })
        return res.status(200).json({
            success: true,
            data: platformUsersList,
            totalCount: totalPlatformUsersCount,
            totalActiveCount : activeUserCount
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}
export const getPlatformUserById = async (req: Request, res: Response) => {
    const { id, role, userType } = req.user!;
    const { userId } = req.params;
    if (!id && !role && !userType) {
        return res.status(401).json({
            success: false,
            message: 'Not Authorized'
        })
    }
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Id required'
        })
    }
    try {
        const getPlatformUserDetails = await prisma.platformUser.findUnique({
            where: { id: Number(userId) },
        })
        return res.status(200).json({
            success: true,
            data: getPlatformUserDetails
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}