import { Router } from "express";
import * as bookController from "./book.controller.js"
import { authenticate, authorize } from "../../middlewares/auth.middleware.js";
import { Role } from "../../generated/prisma/enums.js";

export const bookRouter = Router()

bookRouter.get("/", bookController.getBooks)
bookRouter.get("/:slug", bookController.getBookBySlug)

bookRouter.post("/", authenticate, authorize(Role.AUTHOR, Role.ADMIN), bookController.createBook)

bookRouter.patch("/:id", authenticate, authorize(Role.AUTHOR, Role.ADMIN), bookController.updateBook)

bookRouter.delete("/:id", authenticate, authorize(Role.AUTHOR, Role.ADMIN), bookController.deleteBook)