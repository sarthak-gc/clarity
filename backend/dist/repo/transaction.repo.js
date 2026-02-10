"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepo = void 0;
const prisma_config_1 = __importDefault(require("../config/prisma.config"));
exports.TransactionRepo = {
    createTransaction: (userId, amt, type, date = new Date(), categoryId, description) => {
        return prisma_config_1.default.transaction.create({
            data: {
                userId,
                amt,
                type,
                categoryId,
                description,
                date
            }
        });
    },
    getTransaction: (id) => {
        return prisma_config_1.default.transaction.findUnique({
            where: {
                id,
            }
        });
    },
    getAllTransactions: () => {
        return prisma_config_1.default.transaction.findMany({});
    },
    getAllExpenses: (userId) => {
        return prisma_config_1.default.transaction.findMany({
            where: {
                type: "EXPENSES",
                userId
            }
        });
    },
    getAllIncomes: (userId) => {
        return prisma_config_1.default.transaction.findMany({
            where: {
                type: "INCOME",
                userId
            }
        });
    },
    editTransaction: (id, data) => {
        return prisma_config_1.default.transaction.update({
            where: {
                id,
            },
            data
        });
    },
    deleteTransaction: (id) => {
        return prisma_config_1.default.transaction.delete({
            where: {
                id
            }
        });
    },
    filterTransactionByDate: (startDate, endDate) => {
        return prisma_config_1.default.transaction.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });
    },
    filterTransactionByCategory: (categoryId) => {
        return prisma_config_1.default.transaction.findMany({
            where: {
                categoryId
            }
        });
    }
};
