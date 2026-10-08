import type { NextFunction, Request, Response } from "express";
import 'dotenv/config'
import jwt from 'jsonwebtoken'
import type { JwtPayload } from "jsonwebtoken";
interface TokenPayload extends JwtPayload {
    id: number
    email: string
    userType: 'PLATFORM_USER' | 'TENANT_USER'
    // Platform
    role?: string              // SUPER_ADMIN | SUPPORT_ADMIN
    // Tenant
    tenantId?: number
    branchId?: number
    roleId?: number
    roleCode?: string
}

// Extended Request with unified user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number
                email: string
                userType: 'PLATFORM_USER' | 'TENANT_USER'
                // Platform
                role?: string
                // Tenant
                tenantId?: number
                branchId?: number
                roleId?: number
                roleCode?: string,
                puId: number,
                puRole: string
            }
        }
    }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(400).json({
            success: false,
            message: 'Not authorized login again'
        })
    }
    const jwtsecret = process.env.JWT_SECRET
    if (!jwtsecret) return

    try {
        const decoded = jwt.verify(token, jwtsecret) as TokenPayload

        if (!decoded.id || !decoded.userType) {
            return res.status(401).json({ success: false, message: 'Invalid token' })
        }

        // Attach unified user object
        req.user = {
            id: decoded.id,
            email: decoded.email,
            userType: decoded.userType,
            ...(decoded.userType === 'PLATFORM_USER' ? { role: decoded.role } : {
                tenantId: decoded.tenantId!,
                branchId: decoded.branchId!,
                roleId: decoded.roleId!,
                roleCode: decoded.role!
            }),
            puId: decoded.id,
            puRole: decoded.role || decoded.roleCode!,
            role : decoded.role

        }

        next()
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Token expired or invalid' })
    }
}


export const requirePlatformUser = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.userType !== 'PLATFORM_USER') {
        return res.status(403).json({ success: false, message: 'Platform access required' })
    }
    next()
}

export const requireTenantUser = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.userType !== 'TENANT_USER') {
        return res.status(403).json({ success: false, message: 'Tenant access required' })
    }
    next()
}

