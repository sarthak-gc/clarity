import * as z from "zod";
import { TransactionType } from "../generated/prisma/enums";

export const createTransactionSchema = z.object({
  amt: z.number().min(0, { error: "Amount must be 0 or greater" }),
  type: z.enum(TransactionType, { error: "Transaction type is invalid" }),
  description: z
    .string()
    .min(10, { error: "Description must be at least 10 characters" })
    .optional(),
  date: z
    .date({ error: "Date must be a valid Date" })
    .optional()
    .refine((date) => date && date < new Date(), {
      error: "You can only add transaction for past dates",
    }),
  categoryId: z.string().optional(),
  categoryName: z.string().optional(),
});

export const updateTransactionSchema = z.object({
  amt: z.number().min(0, { error: "Amount must be 0 or greater" }).optional(),
  type: z
    .enum(TransactionType, { error: "Transaction type is invalid" })
    .optional(),
  description: z
    .string()
    .min(10, { error: "Description must be at least 10 characters" })
    .optional(),
  date: z
    .date({ error: "Date must be a valid Date" })
    .optional()
    .refine((date) => date && date < new Date(), {
      error: "You can only add transaction for past dates",
    }),
  categoryId: z.string().optional(),
  categoryName: z.string().optional(),
});

export const getTransactionByDateRangeSchema = z
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

export const getTransactionByCategorySchema = z.object({
  id: z.string().min(1, { error: "Category id is required" }),
});

export const transactionIdSchema = z.object({
  transactionId: z.string().min(1, { error: "transactionId is required" }),
});
