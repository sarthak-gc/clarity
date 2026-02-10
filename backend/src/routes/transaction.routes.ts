import { Router } from "express";
import { TransactionRepo } from "../repo/transaction.repo";
import { success } from "../utils/success";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../utils/error";
import { CategoryRepo } from "../repo/category.repo";
import {
  createTransactionSchema,
  getTransactionByCategorySchema,
  getTransactionByDateRangeSchema,
  transactionIdSchema,
  updateTransactionSchema,
} from "../validations/transaction.validation";

const transactionRoutes = Router();

transactionRoutes.post("/", async (req, res) => {
  const { data, error } = createTransactionSchema.safeParse({
    ...req.body,
    date: new Date(req.body.date),
  });

  if (error) {
    throw new BadRequestError(JSON.parse(error.message)[0].message);
  }
  const { amt, type, date, categoryId, description } = data;
  const userId = req.userId;
  const transaction = await TransactionRepo.createTransaction(
    userId,
    amt,
    type,
    date,
    categoryId,
    description,
  );
  if (!transaction) {
    throw new InternalServerError();
  }
  success(res, "New transaction created", 201, { transaction });
});
transactionRoutes.delete("/:transactionId", async (req, res) => {
  const { data, error } = transactionIdSchema.safeParse(req.params);
  if (error) {
    throw new BadRequestError(JSON.parse(error.message)[0].message);
  }

  const { transactionId } = data;
  const userId = req.userId;
  const transaction = await TransactionRepo.getTransaction(
    transactionId,
    userId,
  );
  if (!transaction) {
    throw new NotFoundError("transaction with that id doesn't exists");
  }
  await TransactionRepo.deleteTransaction(transactionId, userId);
  success(res, "Transaction Deleted");
});

transactionRoutes.patch("/:transactionId", async (req, res) => {
  const { data, error } = updateTransactionSchema.safeParse(req.body);

  if (error) {
    throw new BadRequestError(JSON.parse(error.message)[0].message);
  }

  const { data: transactionData, error: transactionError } =
    transactionIdSchema.safeParse(req.params);
  if (transactionError) {
    throw new BadRequestError(JSON.parse(transactionError.message)[0].message);
  }

  const { transactionId } = transactionData;

  const userId = req.userId;
  const transaction = await TransactionRepo.getTransaction(
    transactionId,
    userId,
  );
  if (!transaction) {
    throw new NotFoundError("transaction with that id doesn't exists");
  }
  let updatedData: any = {};

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
    const category = await CategoryRepo.getCategoryById(categoryId);
    if (!category) {
      throw new NotFoundError("Category not found");
    }
  }

  await TransactionRepo.editTransaction(transactionId, userId, updatedData);
  success(res, "Transaction updated");
});

transactionRoutes.get("/expenses", async (req, res) => {
  const page = Math.max(Number(req.query.p || 0), 0);
  const userId = req.userId;
  const transactions = await TransactionRepo.getAllExpenses(userId, page);
  success(res, "Transaction retrieved", 200, { transactions });
});

transactionRoutes.get("/incomes", async (req, res) => {
  const userId = req.userId;
  const page = Math.max(Number(req.query.p || 0), 0);
  const transactions = await TransactionRepo.getAllIncomes(userId, page);
  success(res, "Transaction retrieved", 200, { transactions });
});

transactionRoutes.get("/:transactionId", async (req, res) => {
  const { data: transactionData, error: transactionError } =
    transactionIdSchema.safeParse(req.params);
  if (transactionError) {
    throw new BadRequestError(JSON.parse(transactionError.message)[0].message);
  }

  const { transactionId } = transactionData;

  const userId = req.userId;
  const transaction = await TransactionRepo.getTransaction(
    transactionId,
    userId,
  );
  success(res, "Transaction retrieved", 200, { transaction });
});

transactionRoutes.get("/", async (req, res) => {
  const { sd, ed, categoryId } = req.query;
  const page = Math.max(Number(req.query.p || 0), 0);
  if (sd) {
    const { data, error } = getTransactionByDateRangeSchema.safeParse({
      sd,
      ed,
    });

    if (error) {
      throw new BadRequestError(JSON.parse(error.message)[0].message);
    }
    const { sd: startDate, ed: endDate } = data;
    const userId = req.userId;
    const transactions = await TransactionRepo.filterTransactionByDate(
      userId,
      new Date(startDate),
      new Date(endDate),
      page,
    );
    success(res, "Transaction retrieved", 200, { transactions });
    return;
  }
  if (categoryId) {
    const { data, error } = getTransactionByCategorySchema.safeParse({
      id: categoryId,
    });

    if (error) {
      throw new BadRequestError(JSON.parse(error.message)[0].message);
    }
    const { id } = data;
    const category = await CategoryRepo.getCategoryById(id);

    if (!category) {
      throw new NotFoundError("Category not found");
    }
    const userId = req.userId;
    const transactions = await TransactionRepo.filterTransactionByCategory(
      userId,
      id,
      page,
    );
    success(res, "Transaction retrieved", 200, { transactions });
    return;
  }

  const transactions = await TransactionRepo.getAllTransactions(
    req.userId,
    page,
  );
  success(res, "Transaction retrieved", 200, { transactions });
});

export default transactionRoutes;
