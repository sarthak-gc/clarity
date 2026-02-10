import prisma from "../config/prisma.config";
import { TransactionType } from "../generated/prisma/enums";
export const TransactionRepo = {
  createTransaction: (
    userId: string,
    amt: number,
    type: TransactionType,
    date: Date = new Date(),
    categoryId?: string,
    description?: string,
  ) => {
    return prisma.transaction.create({
      data: {
        userId,
        amt,
        type,
        categoryId: categoryId || null,
        description,
        date,
      },
      include: {
        category: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
  },
  getTransaction: (id: string, userId: string) => {
    return prisma.transaction.findUnique({
      where: {
        id,
        userId,
      },
      include: {
        category: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });
  },
  getAllTransactions: (userId: string, page: number, take: number = 10) => {
    return prisma.transaction.findMany({
      where: { userId },
      include: {
        category: {
          select: {
            name: true,
            id: true,
          },
        },
      },
      take,
      skip: page * take,
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  getAllExpenses: (userId: string, page: number, take: number = 10) => {
    return prisma.transaction.findMany({
      where: {
        type: "EXPENSES",
        userId,
      },
      take,
      skip: page * take,
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  getAllIncomes: (userId: string, page: number, take: number = 10) => {
    return prisma.transaction.findMany({
      where: {
        type: "INCOME",
        userId,
      },
      take,
      skip: page * take,
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  editTransaction: (id: string, userId: string, data: any) => {
    return prisma.transaction.update({
      where: {
        id,
        userId,
      },
      data,
    });
  },
  deleteTransaction: (id: string, userId: string) => {
    return prisma.transaction.delete({
      where: {
        id,
        userId,
      },
    });
  },
  filterTransactionByDate: (
    userId: string,
    startDate: Date,
    endDate: Date,
    page: number,
    take: number = 10,
  ) => {
    return prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      take,
      skip: page * take,
    });
  },
  filterTransactionByCategory: (
    userId: string,
    categoryId: string,
    page: number,
    take: number = 10,
  ) => {
    return prisma.transaction.findMany({
      where: {
        categoryId,
        userId,
      },
      take,
      skip: page * take,
    });
  },
};
