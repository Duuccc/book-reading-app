import { Router } from "express";
import * as notifyController from "./notification.controller.js"
import { authenticate } from "../../middlewares/auth.middleware.js";

export const notificationRouter = Router()

notificationRouter.use(authenticate)

notificationRouter.post("/follows/:bookId", notifyController.toggleFollow)
notificationRouter.get("/follows/:bookId/check", notifyController.checkFollow)
notificationRouter.get("/follows", notifyController.getFollowedBooks)

notificationRouter.get("/", notifyController.getNotifications)
notificationRouter.patch("/:id/read", notifyController.markAsRead)
notificationRouter.patch("/read-all", notifyController.markAllAsRead)
notificationRouter.delete("/:id", notifyController.deleteNotification)