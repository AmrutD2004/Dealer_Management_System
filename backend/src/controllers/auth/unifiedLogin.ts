import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../../prisma/lib/prisma';
import { generateToken, setAuthCookies } from '../../helpers/generateToken';


export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    try {

        // ==========================================
        // 1. CHECK PLATFORM USER
        // ==========================================

        const platformUser = await prisma.platformUser.findFirst({
            where: {
                email: email
            }
        });

        if (platformUser) {

            if (!platformUser.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Your account is inactive'
                });
            }

            const passwordMatch = await bcrypt.compare(
                password,
                platformUser.passwordHash
            );

            if (passwordMatch) {

                const token = generateToken({
                    id: platformUser.id,
                    email: platformUser.email,
                    role: platformUser.role,
                    userType: 'PLATFORM_USER'
                });

                setAuthCookies(res, token);

                return res.status(200).json({
                    success: true,
                    userType: 'PLATFORM_USER',
                    message: 'Login Successful'
                });
            }
        }


        // ==========================================
        // 2. CHECK TENANT USER
        // ==========================================

        const tenantUser = await prisma.users.findFirst({
            where: {
                email: email
            },
            include: {
                role: true
            }
        });

        if (tenantUser) {

            if (!tenantUser.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Your account is inactive'
                });
            }

            const passwordMatch = await bcrypt.compare(
                password,
                tenantUser.passwordHash
            );

            if (passwordMatch) {

                await prisma.users.update({
                    where: {
                        id: tenantUser.id
                    },
                    data: {
                        lastLoginAt: new Date()
                    }
                });

                const token = generateToken({
                    id: tenantUser.id,
                    email: tenantUser.email,
                    tenantId: tenantUser.tenantId,
                    branchId: tenantUser.branchId,
                    roleCode: tenantUser.role?.roleCode,
                    userType: 'TENANT_USER'
                });

                setAuthCookies(res, token);

                return res.status(200).json({
                    success: true,
                    userType: 'TENANT_USER',
                    message: 'Login Successful'
                });
            }
        }


        // ==========================================
        // 3. INVALID CREDENTIALS
        // ==========================================

        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });

    } catch (error) {

        console.error('Login error:', error);

        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


export const isAuthenticated = async (req: Request, res: Response) => {
    const { id, userType, tenantId } = req.user!

    try {
        let userData: any

        if (userType === 'PLATFORM_USER') {
            userData = await prisma.platformUser.findUnique({
                where: { id },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    updatedAt: true
                }
            })
        } else { // TENANT_USER
            userData = await prisma.users.findUnique({
                where: { id },
                include: {
                    role: { select: { id: true, roleCode: true, roleName: true } },
                    branch: { select: { id: true, branchCode: true, branchName: true } },
                    tenant: { select: { id: true, tenantCode: true, tenantName: true, subscriptionStatus: true } }
                }
            })
            // Remove passwordHash
            if (userData) delete userData.passwordHash
        }

        if (!userData) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        return res.status(200).json({
            success: true,
            userType,
            data: userData
        })

    } catch (error) {
        console.error('Auth me error:', error)
        return res.status(500).json({ success: false, message: 'Internal server error' })
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