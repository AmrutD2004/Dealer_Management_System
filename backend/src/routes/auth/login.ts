import { Router } from "express";
import { isAuthenticated, login, logout } from "../../controllers/auth/unifiedLogin";
import { authenticate } from "../../middlewares/authMiddleware/loginMiddelware";

const unifiedLogin = Router()

unifiedLogin.post('/auth/login', login)
unifiedLogin.get('/auth/me', authenticate, isAuthenticated)
unifiedLogin.post('/logout', logout)

export default unifiedLogin