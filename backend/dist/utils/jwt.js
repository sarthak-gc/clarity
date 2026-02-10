"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.signJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const signJWT = (data) => {
    const token = jsonwebtoken_1.default.sign(data, env_1.JWT_SECRET);
    return token;
};
exports.signJWT = signJWT;
const verifyJWT = (token) => {
    try {
        const data = jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
        return data;
    }
    catch {
        return "";
    }
};
exports.verifyJWT = verifyJWT;
