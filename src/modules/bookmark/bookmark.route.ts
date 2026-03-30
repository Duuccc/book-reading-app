import { Router } from "express";
import * as bookmarkController from "./bookmark.controller.js"
import { authenticate } from "../../middlewares/auth.middleware.js";

export const bookmarkRouter = Router()

bookmarkRouter.use(authenticate)

bookmarkRouter.post("/", bookmarkController.toggleBookmark)
bookmarkRouter.get("/", bookmarkController.getUserBookmarks)
bookmarkRouter.get("/check", bookmarkController.checkBookmark)
