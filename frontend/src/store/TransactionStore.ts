import type { TransactionI } from "@/types/all";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TransactionStoreI {
  transactions: TransactionI[];
  setTransactions: (transactions: TransactionI[]) => void;
  addTransaction: (transaction: TransactionI) => void;
  addTransactions: (transactions: TransactionI[]) => void;

  removeTransaction: (transactionId: string) => void;
}

export const useTransactionStore = create<TransactionStoreI>()(
  persist(
    (set) => ({
      transactions: [] as TransactionI[],
      setTransactions: (transactions: TransactionI[]) =>
        set(() => ({ transactions: [...transactions] })),

      addTransaction: (transaction: TransactionI) =>
        set((state) => ({
          transactions: [...state.transactions, transaction],
        })),
      addTransactions: (transactions: TransactionI[]) =>
        set((state) => ({
          transactions: [...state.transactions, ...transactions],
        })),
      removeTransaction: (transactionId: string) =>
        set((state) => ({
          transactions: state.transactions.filter(
            (t) => t.id !== transactionId,
          ),
        })),
    }),
    {
      name: "transactions-store",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
