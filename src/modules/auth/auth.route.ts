import { Router } from "express";
import * as authController from "./auth.controller.js"
import { registerValidator, loginValidator } from "./auth.validator.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

export const authRouter = Router()

authRouter.post("/register", registerValidator, authController.register)
authRouter.post("/login", loginValidator, authController.login)
authRouter.post("/refresh", authController.refreshToken)
authRouter.post("/logout", authController.logout)
authRouter.post("/logout-all", authenticate, authController.logoutAll)