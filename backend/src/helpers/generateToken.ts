import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { Response } from 'express';
export const generateToken = (payload: {}) => {
    const jwtsecret = process.env.JWT_SECRET;
    if (!jwtsecret) return;
    return jwt.sign(payload, jwtsecret, { expiresIn: '1d' })
}


export const setAuthCookies = (res: Response, token: string | undefined) => {
    res.cookie('token', token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production' ? true : false,
        path : '/',
        maxAge : 24 * 60 * 60 *1000
    })
}