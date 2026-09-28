import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";
import bcrypt from 'bcrypt'

export const createPlatformUser = async (req: Request, res: Response) => {
    const { email, passwordHash } = req.body;
    if (!email || !passwordHash) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        })
    }
    const count = await prisma.platformUser.count()
    const userExist = await prisma.platformUser.findFirst({
        where: { email: email }
    })
    if (userExist) {
        return res.status(409).json({
            success: false,
            message: `User already exists with ${userExist.email}`
        })
    }
    const hashedPassword = await bcrypt.hash(passwordHash, 8)
    if (count === 0) {
        await prisma.platformUser.create({
            data: {
                email: email,
                passwordHash: hashedPassword,
                role: 'SUPER_ADMIN'
            }
        })
    }
    else {
        await prisma.platformUser.create({
            data: {
                email: email,
                passwordHash: hashedPassword,
                role: 'SUPPORT_ADMIN'
            }
        })
    }
    return res.status(201).json({
        success: true,
        message: 'PlatformUser created successfully'
    })
}

export const login = async (req: Request, res: Response) => {

}