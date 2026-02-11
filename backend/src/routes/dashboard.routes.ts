import { Request, Response, Router } from "express";
import { TransactionRepo } from "../repo/transaction.repo";
import { success } from "../utils/success";

const dashboardRoutes = Router();

type LineGraphPoint = {
  date: string;
  income: number;
  expense: number;
};

dashboardRoutes.get("/", async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.p || 0), 0);

  const userId = req.userId;
  const endDate = Date.now();
  const startDate = new Date(endDate - 90 * 24 * 60 * 60 * 1000);
  const totalTransactions = await TransactionRepo.filterTransactionByDate(
    userId,
    startDate,
    new Date(endDate),
    page,
  );
  const totalIncome = totalTransactions
    .filter((txn) => {
      return txn.type == "INCOME";
    })
    .reduce((prev, current) => {
      return prev + current.amt;
    }, 0);

  const totalExpenses = totalTransactions
    .filter((txn) => {
      return txn.type == "EXPENSES";
    })
    .reduce((prev, current) => {
      return prev + current.amt;
    }, 0);

  const netBalance = totalIncome - totalExpenses;

  const recentTransactions = await TransactionRepo.getAllTransactions(
    userId,
    0,
  );

  const dailyMap: Map<string, LineGraphPoint> = new Map();

  for (const txn of totalTransactions) {
    const rawDate = txn.date ?? txn.createdAt;
    const day = rawDate.toISOString().split("T")[0];

    if (!dailyMap.has(day)) {
      dailyMap.set(day, {
        date: day,
        income: 0,
        expense: 0,
      });
    }

    const oldIncome = dailyMap.get(day)!.income || 0;
    const oldExpense = dailyMap.get(day)!.expense || 0;
    if (txn.type === "INCOME") {
      dailyMap.set(day, {
        income: oldIncome + txn.amt,
        date: day,
        expense: oldExpense,
      });
    } else {
      dailyMap.set(day, {
        income: oldIncome,
        date: day,
        expense: oldExpense + txn.amt,
      });
    }
  }
  const lineGraphData = Array.from(dailyMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  const dashboardData = {
    totalIncome,
    totalExpenses,
    netBalance,
    recentTransactions: recentTransactions.map((txn) => ({
      id: txn.id,
      type: txn.type,
      amt: txn.amt,
      description: txn.description,
      date: txn.date?.toISOString() || new Date().toISOString(),
      categoryId: txn.categoryId,
      createdAt: txn.createdAt.toISOString(),
      updatedAt: txn.updatedAt.toISOString(),
      userId: txn.userId,
      category: txn.category ? {
        id: txn.category.id,
        name: txn.category.name,
      } : null,
    })),
    lineGraphData,
  };
  success(res, "Dashboard data retrieved", 200, { dashboardData });
});

dashboardRoutes.get("/activity-log", async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.p || 0), 0);
  const userId = req.userId;
  const endDate = Date.now();
  const startDate = new Date(endDate - 90 * 24 * 60 * 60 * 1000);
  const totalTransactions = await TransactionRepo.filterTransactionByDate(
    userId,
    startDate,
    new Date(endDate),
    page,
  );

  const dailyMap: Map<string, LineGraphPoint> = new Map();

  for (const txn of totalTransactions) {
    const rawDate = txn.date ?? txn.createdAt;
    const day = rawDate.toISOString().split("T")[0];

    if (!dailyMap.has(day)) {
      dailyMap.set(day, {
        date: day,
        income: 0,
        expense: 0,
      });
    }

    const oldIncome = dailyMap.get(day)!.income || 0;
    const oldExpense = dailyMap.get(day)!.expense || 0;
    if (txn.type === "INCOME") {
      dailyMap.set(day, {
        income: oldIncome + txn.amt,
        date: day,
        expense: oldExpense,
      });
    } else {
      dailyMap.set(day, {
        income: oldIncome,
        date: day,
        expense: oldExpense + txn.amt,
      });
    }
  }
  const lineGraphData = Array.from(dailyMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  success(res, "Activity log retrieved", 200, { lineGraphData });
});
export default dashboardRoutes;
