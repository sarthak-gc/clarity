"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionIdSchema = exports.getTransactionByCategorySchema = exports.getTransactionByDateRangeSchema = exports.updateTransactionSchema = exports.createTransactionSchema = void 0;
const z = __importStar(require("zod"));
const enums_1 = require("../generated/prisma/enums");
exports.createTransactionSchema = z.object({
    amt: z.number().min(0, { error: "Amount must be 0 or greater" }),
    type: z.enum(enums_1.TransactionType, { error: "Transaction type is invalid" }),
    description: z
        .string()
        .min(10, { error: "Description must be at least 10 characters" })
        .optional(),
    date: z.date({ error: "Date must be a valid Date" }),
    categoryId: z.string().min(1, { error: "categoryId is required" }),
});
exports.updateTransactionSchema = z.object({
    amt: z.number().min(0, { error: "Amount must be 0 or greater" }).optional(),
    type: z.enum(enums_1.TransactionType, { error: "Transaction type is invalid" }).optional(),
    description: z
        .string()
        .min(10, { error: "Description must be at least 10 characters" })
        .optional(),
    date: z.date({ error: "Date must be a valid Date" }).optional(),
    categoryId: z.string().min(1, { error: "categoryId is required" }).optional(),
});
exports.getTransactionByDateRangeSchema = z
    .object({
    sd: z.date({ error: "Start date (sd) must be a valid Date" }),
    ed: z.date({ error: "End date (ed) must be a valid Date" }),
})
    .refine(({ sd, ed }) => sd <= ed, {
    path: ["ed"],
    error: "End date must be the same as or after the start date",
})
    .refine(({ sd }) => sd <= new Date(), {
    path: ["sd"],
    error: "Start date cannot be in the future",
})
    .refine(({ ed }) => ed <= new Date(), {
    path: ["ed"],
    error: "End date cannot be in the future",
});
exports.getTransactionByCategorySchema = z.object({
    id: z.string().min(1, { error: "Category id is required" }),
});
exports.transactionIdSchema = z.object({
    transactionId: z.string().min(1, { error: "transactionId is required" }),
});
