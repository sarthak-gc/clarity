"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_repo_1 = require("../repo/user.repo");
const error_1 = require("../utils/error");
const jwt_1 = require("../utils/jwt");
const success_1 = require("../utils/success");
const auth_validation_1 = require("../validations/auth.validation");
const authRoutes = (0, express_1.Router)();
authRoutes.post('/login', async (req, res) => {
    const { data, error } = auth_validation_1.authSchema.safeParse(req.body);
    if (error) {
        throw new error_1.BadRequestError(JSON.parse(error.message)[0].message);
    }
    const { username, password } = data;
    const userExists = await user_repo_1.UserRepo.findUserByUserName(username);
    if (!userExists) {
        throw new error_1.UnauthorizedError("Invalid credentials");
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 12);
    const isPasswordMatch = await bcrypt_1.default.compare(password, hashedPassword);
    if (!isPasswordMatch) {
        throw new error_1.UnauthorizedError("Invalid credentials");
    }
    const token = (0, jwt_1.signJWT)({
        username: userExists.username,
        userId: userExists.id
    });
    (0, success_1.success)(res, "Logged in successfully", 200, { token });
});
authRoutes.post('/register', async (req, res) => {
    const { data, error } = auth_validation_1.authSchema.safeParse(req.body);
    if (error) {
        throw new error_1.BadRequestError(JSON.parse(error.message)[0].message);
    }
    const { username, password } = data;
    const userExists = await user_repo_1.UserRepo.findUserByUserName(username);
    if (userExists) {
        throw new error_1.ConflictError("User with that username already exists. Try different username");
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 12);
    const user = await user_repo_1.UserRepo.createUser(username, hashedPassword);
    const token = (0, jwt_1.signJWT)({
        username,
        userId: user.id
    });
    (0, success_1.success)(res, "user created", 201, { token });
});
exports.default = authRoutes;
