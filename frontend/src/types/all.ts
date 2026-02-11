export interface Category {
  name: string;
  id: string;
}

export type TransactionI = {
  type: "INCOME" | "EXPENSES";
  id: string;
  createdAt: Date;
  userId: string;
  categoryId: string | null;
  amt: number;
  description: string | null;
  date: string;
  updatedAt: Date;
  category?: Category;
};

export type TransactionToAdd = {
  type: "INCOME" | "EXPENSES";
  categoryId: string | null;
  amt: number;
  description: string | null;
  date: Date;
};

export type LineGraphPoint = {
  date: string;
  income: number;
  expense: number;
};
export type DashboardI = {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  recentTransactions: TransactionI[];
};

export type SortByType =
  | "date ascending"
  | "date descending"
  | "amount ascending"
  | "amount descending"
  | "income"
  | "expenses";
