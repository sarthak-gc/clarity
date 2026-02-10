"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepo = void 0;
const prisma_config_1 = __importDefault(require("../config/prisma.config"));
exports.UserRepo = {
    findUserByUserName: (name) => {
        return prisma_config_1.default.user.findUnique({
            where: {
                username: name
            }
        });
    },
    findUserByUserId: (userId) => {
        return prisma_config_1.default.user.findUnique({
            where: {
                id: userId
            }
        });
    },
    createUser: (username, password) => {
        return prisma_config_1.default.user.create({
            data: {
                username,
                password
            }
        });
    }
};
