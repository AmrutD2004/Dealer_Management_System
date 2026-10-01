import { Request, Response } from "express";
import { prisma } from "../../prisma/lib/prisma";
import bcrypt from 'bcrypt'
import 'dotenv/config'
import jwt from 'jsonwebtoken'

const jwtsecret = process.env.JWT_SECRET;
export const createPlatformUser = async (req: Request, res: Response) => {
    const { email, passwordHash } = req.body;

    if (!email || !passwordHash) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
        });
    }
    try {
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
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const login = async (req: Request, res: Response) => {
    if (!jwtsecret) {
        return res.json({
            success: false,
            message: 'Jwt secret not present'
        })
    }
    const { email, passwordHash } = req.body;
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
        if (!isUserExist) {
            return res.status(404).json({
                success: false,
                message: 'Email not exists'
            })
        }
        const isMatched = await bcrypt.compare(passwordHash, isUserExist.passwordHash)
        if (!isMatched) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }
        const token = jwt.sign({ id: isUserExist?.id, role: isUserExist?.role }, jwtsecret, { expiresIn: '1d' })
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production' ? true : false,
            path: '/',
            maxAge: 24 * 60 * 60 * 1000
        })
        return res.status(200).json({
            success: true,
            message: 'Login successfull'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        })
    }
}

export const isAuthenticated = async (req: Request, res: Response) => {
    const { puId, puRole } = req.user;
    if (!puId && !puRole) {
        return res.status(400).json({
            success: false,
            message: 'Not Authorized'
        })
    }
    try {
        const data = await prisma.platformUser.findUnique({
            where: { id: puId }
        })
        return res.status(200).json({
            success: true,
            data: data,
            message: 'User is authenticated'
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: `Server Error ${err}`
        })
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production' ? true : false,
            path: '/'
        })
        return res.status(200).json({
            success: true,
            message: 'Logout successfull'
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: 'Something went wrong'
        })
    }
}


export const addPlatformUsers = async (req: Request, res: Response) => {
    const { puId, puRole } = req.user;
    const { email, passwordHash, role } = req.body;
    if (!puId && !puRole) {
        return res.status(401).json({
            success: false,
            message: 'Not Authorized'
        })
    }
    if (puRole !== 'SUPER_ADMIN') {
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
                role : role
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