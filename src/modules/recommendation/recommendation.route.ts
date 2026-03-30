import { Router } from "express";
import * as recController from "./recommendation.controller.js"
import { authenticate } from "../../middlewares/auth.middleware.js";

export const recommendationRouter = Router()

recommendationRouter.get("/trending", recController.getTrendingBooks)
recommendationRouter.get("/for-you", authenticate, recController.getPersonalizedBooks)
recommendationRouter.get("/similar/:bookId", recController.getSimilarBooks)