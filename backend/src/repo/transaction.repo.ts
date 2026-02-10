import prisma from "../config/prisma.config"
import { TransactionType } from "../generated/prisma/enums"
export const TransactionRepo = {
  createTransaction: (userId: string, amt: number, type: TransactionType, date: Date = new Date(), categoryId?: string, description?: string) => {
    return prisma.transaction.create({
      data: {
        userId,
        amt,
        type,
        categoryId,
        description,
        date
      }
    })
  },
  getTransaction: (id: string) => {
    return prisma.transaction.findUnique({
      where: {
        id,
      }
    })
  },
  getAllTransactions: () => {
    return prisma.transaction.findMany({})
  },
  getAllExpenses: (userId: string) => {
    return prisma.transaction.findMany({
      where: {
        type: "EXPENSES",
        userId
      }
    })
  },
  getAllIncomes: (userId: string) => {
    return prisma.transaction.findMany({
      where: {
        type: "INCOME",
        userId
      }
    })
  },
  editTransaction: (id: string, data: any) => {
    return prisma.transaction.update({
      where: {
        id,
      },
      data
    })
  },
  deleteTransaction: (id: string) => {
    return prisma.transaction.delete({
      where: {
        id
      }
    })
  },
  filterTransactionByDate: (startDate: Date, endDate: Date) => {
    return prisma.transaction.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    })
  },
  filterTransactionByCategory: (categoryId: string) => {
    return prisma.transaction.findMany({
      where: {
        categoryId
      }
    })
  }
}
