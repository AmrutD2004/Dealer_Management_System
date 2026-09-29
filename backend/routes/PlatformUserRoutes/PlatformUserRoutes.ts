import { Router } from "express";
import { createPlatformUser, login } from "../../controller/platformUserControllers/platformuserAuthController";

const platformuserRoutes = Router()


platformuserRoutes.post('/platformuser/create', createPlatformUser)
platformuserRoutes.post('/platformuser/login', login)
export default platformuserRoutes