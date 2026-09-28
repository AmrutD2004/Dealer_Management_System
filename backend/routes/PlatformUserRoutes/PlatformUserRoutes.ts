import { Router } from "express";
import { createPlatformUser } from "../../controller/platformUserControllers/platformuserAuthController";

const platformuserRoutes = Router()


platformuserRoutes.post('/platformuser/create', createPlatformUser)
export default platformuserRoutes