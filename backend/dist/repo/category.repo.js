"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRepo = void 0;
const prisma_config_1 = __importDefault(require("../config/prisma.config"));
exports.CategoryRepo = {
    getAllCategories: (userId) => {
        return prisma_config_1.default.category.findMany({
            where: {
                userId
            }
        });
    },
    editCategory: (name) => {
        return prisma_config_1.default.category.create({
            data: {
                name,
            }
        });
    },
    addCategory: (name) => {
        return prisma_config_1.default.category.create({
            data: {
                name,
            }
        });
    },
    removeCategory: (id) => {
        return prisma_config_1.default.category.delete({
            where: { id }
        });
    },
    getCategoryById: (id) => {
        return prisma_config_1.default.category.findUnique({
            where: {
                id
            }
        });
    },
};
