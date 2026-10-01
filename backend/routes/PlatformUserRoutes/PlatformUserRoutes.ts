import { Router } from "express";
import { addPlatformUsers, createPlatformUser, deletePlatformUser, editPlatformUser, getListOfPlatformUsers, getPlatformUserById, isAuthenticated, login } from "../../controller/platformUserControllers/platformuserAuthController";
import { platformUserAuth } from "../../middlerwares/platformAdminMiddleware";

const platformuserRoutes = Router()


platformuserRoutes.post('/platformuser/create', createPlatformUser)
platformuserRoutes.post('/platformuser/login', login)
platformuserRoutes.get('/platformuser/auth', platformUserAuth ,isAuthenticated)
platformuserRoutes.post('/platform/newuser/create', platformUserAuth, addPlatformUsers)
platformuserRoutes.put('/platform/user/update/:id', platformUserAuth, editPlatformUser)
platformuserRoutes.delete('/platform/user/delete/:id', platformUserAuth, deletePlatformUser)
platformuserRoutes.get('/platform/users/get/all', platformUserAuth, getListOfPlatformUsers)
platformuserRoutes.get('/platform/user/get/:id', platformUserAuth, getPlatformUserById)

export default platformuserRoutes