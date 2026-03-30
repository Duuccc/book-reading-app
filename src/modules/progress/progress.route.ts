import { Router } from "express";
import * as progressController from "./progress.controller.js"
import { authenticate } from "../../middlewares/auth.middleware.js";

export const progressRouter = Router()

progressRouter.use(authenticate)

progressRouter.post("/", progressController.upsertProgress)
progressRouter.get('/', progressController.getAllProgress)
progressRouter.get("/:bookId", progressController.getProgress)
progressRouter.delete("/:bookId", progressController.deleteProgress)