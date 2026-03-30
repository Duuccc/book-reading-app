import { body } from "express-validator";

export const registerValidator = [
    body("email")
    .isEmail().withMessage("Invalid email")
    ,

    body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must have from 3 to 30 words")
    ,

    body("password")
    .isLength({ min: 8 })
    .withMessage("password has at least 8 characters")
    
]

export const loginValidator = [
    body("email")
    .isEmail().withMessage("aaaa")
    .normalizeEmail(),

    body("password")
    .notEmpty().withMessage("should not be set empty")
]