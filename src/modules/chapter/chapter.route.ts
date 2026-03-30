import { Router } from "express";
import * as chapterController from "./chapter.controller.js"
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { Role } from "../../generated/prisma/enums.js";

export const chapterRouter = Router({mergeParams: true})

chapterRouter.get("/", chapterController.getChapters)

chapterRouter.get("/:chapterNumber/read", chapterController.readChapter)

chapterRouter.post("/", authenticate, authorize(Role.AUTHOR, Role.ADMIN), chapterController.createChapter)

chapterRouter.patch("/:id", authenticate, authorize(Role.AUTHOR, Role.ADMIN), chapterController.updateChapter)

chapterRouter.delete("/:id", authenticate, authorize(Role.AUTHOR,Role.ADMIN), chapterController.deleteChapter)