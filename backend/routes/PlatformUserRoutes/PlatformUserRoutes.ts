import { Router } from "express";
import { createPlatformUser, isAuthenticated, login } from "../../controller/platformUserControllers/platformuserAuthController";
import { platformUserAuth } from "../../middlerwares/platformAdminMiddleware";

const platformuserRoutes = Router()


platformuserRoutes.post('/platformuser/create', createPlatformUser)
platformuserRoutes.post('/platformuser/login', login)
platformuserRoutes.get('/platformuser/auth', platformUserAuth ,isAuthenticated)
export default platformuserRoutes