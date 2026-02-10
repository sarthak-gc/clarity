"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transaction_repo_1 = require("../repo/transaction.repo");
const success_1 = require("../utils/success");
const error_1 = require("../utils/error");
const category_repo_1 = require("../repo/category.repo");
const transaction_validation_1 = require("../validations/transaction.validation");
const transactionRoutes = (0, express_1.Router)();
transactionRoutes.post('/', async (req, res) => {
    const { data, error } = transaction_validation_1.createTransactionSchema.safeParse(req.body);
    if (error) {
        throw new error_1.BadRequestError(JSON.parse(error.message)[0].message);
    }
    const { amt, type, date, categoryId, description } = data;
    const userId = req.userId;
    const transaction = await transaction_repo_1.TransactionRepo.createTransaction(userId, amt, type, date, categoryId, description);
    if (!transaction) {
        throw new error_1.InternalServerError();
    }
    (0, success_1.success)(res, "New transaction created", 201, { transaction });
});
transactionRoutes.delete("/:transactionId", async (req, res) => {
    const { data, error } = transaction_validation_1.transactionIdSchema.safeParse(req.params);
    if (error) {
        throw new error_1.BadRequestError(JSON.parse(error.message)[0].message);
    }
    const { transactionId } = data;
    const transaction = await transaction_repo_1.TransactionRepo.getTransaction(transactionId);
    if (!transaction) {
        throw new error_1.NotFoundError("transaction with that id doesn't exists");
    }
    await transaction_repo_1.TransactionRepo.deleteTransaction(transactionId);
    (0, success_1.success)(res, "Transaction Deleted");
});
transactionRoutes.patch("/:transactionId", async (req, res) => {
    const { data, error } = transaction_validation_1.updateTransactionSchema.safeParse(req.body);
    if (error) {
        throw new error_1.BadRequestError(JSON.parse(error.message)[0].message);
    }
    const { data: transactionData, error: transactionError } = transaction_validation_1.transactionIdSchema.safeParse(req.params);
    if (transactionError) {
        throw new error_1.BadRequestError(JSON.parse(transactionError.message)[0].message);
    }
    const { transactionId } = transactionData;
    const transaction = await transaction_repo_1.TransactionRepo.getTransaction(transactionId);
    if (!transaction) {
        throw new error_1.NotFoundError("transaction with that id doesn't exists");
    }
    let updatedData = {};
    const { amt, type, date, categoryId, description } = data;
    if (amt) {
        updatedData.amt = amt;
    }
    if (type) {
        updatedData.type = type;
    }
    if (description) {
        updatedData.description = description;
    }
    if (date) {
        updatedData.date = new Date(date);
    }
    if (categoryId) {
        updatedData.categoryId = categoryId;
        // check if category with that id exists
        const category = await category_repo_1.CategoryRepo.getCategoryById(categoryId);
        if (!category) {
            throw new error_1.NotFoundError("Category not found");
        }
    }
    await transaction_repo_1.TransactionRepo.editTransaction(transactionId, updatedData);
    (0, success_1.success)(res, "Transaction updated");
});
transactionRoutes.get("/expenses", async (req, res) => {
    const userId = req.userId;
    const transactions = await transaction_repo_1.TransactionRepo.getAllExpenses(userId);
    (0, success_1.success)(res, "Transaction retrieved", 200, { transactions });
});
transactionRoutes.get("/incomes", async (req, res) => {
    const userId = req.userId;
    const transactions = await transaction_repo_1.TransactionRepo.getAllIncomes(userId);
    (0, success_1.success)(res, "Transaction retrieved", 200, { transactions });
});
transactionRoutes.get("/:transactionId", async (req, res) => {
    const { data: transactionData, error: transactionError } = transaction_validation_1.transactionIdSchema.safeParse(req.params);
    if (transactionError) {
        throw new error_1.BadRequestError(JSON.parse(transactionError.message)[0].message);
    }
    const { transactionId } = transactionData;
    const transaction = await transaction_repo_1.TransactionRepo.getTransaction(transactionId);
    (0, success_1.success)(res, "Transaction retrieved", 200, { transaction });
});
transactionRoutes.get("/", async (req, res) => {
    const { sd, ed, categoryId } = req.query;
    if (sd) {
        const { data, error } = transaction_validation_1.getTransactionByDateRangeSchema.safeParse({ sd, ed });
        if (error) {
            throw new error_1.BadRequestError(JSON.parse(error.message)[0].message);
        }
        const { sd: startDate, ed: endDate } = data;
        const transactions = await transaction_repo_1.TransactionRepo.filterTransactionByDate(new Date(startDate), new Date(endDate));
        (0, success_1.success)(res, "Transaction retrieved", 200, { transactions });
        return;
    }
    if (categoryId) {
        const { data, error } = transaction_validation_1.getTransactionByCategorySchema.safeParse({ sd, ed });
        if (error) {
            throw new error_1.BadRequestError(JSON.parse(error.message)[0].message);
        }
        const { id } = data;
        const category = await category_repo_1.CategoryRepo.getCategoryById(id);
        if (!category) {
            throw new error_1.NotFoundError("Category not found");
        }
        const transactions = await transaction_repo_1.TransactionRepo.filterTransactionByCategory(id);
        (0, success_1.success)(res, "Transaction retrieved", 200, { transactions });
        return;
    }
    const transactions = await transaction_repo_1.TransactionRepo.getAllTransactions();
    (0, success_1.success)(res, "Transaction retrieved", 200, { transactions });
});
exports.default = transactionRoutes;
