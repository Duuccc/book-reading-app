import { Router } from 'express';
import * as reviewController from './review.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

export const reviewRouter = Router({mergeParams: true})

reviewRouter.get("/", reviewController.getBookReviews)

reviewRouter.post("/", authenticate, reviewController.createReview)
reviewRouter.get("/my-review", authenticate, reviewController.getUserReview)
reviewRouter.patch('/:id', authenticate, reviewController.updateReview)
reviewRouter.delete("/:id", authenticate, reviewController.deleteReview)