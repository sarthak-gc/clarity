import { useTransactionStore } from "@/store/TransactionStore";
import type { SortByType, TransactionI } from "@/types/all";
import { ChevronDownIcon, ChevronUpIcon, Edit, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { TransactionEdit } from "@/components/TransactionEdit";
import { Button } from "@/components/ui/button";

export const Transactions = ({
  type,
  onUpdate,
  onDelete,
  transactionsData,
}: {
  type?: "EXPENSES" | "INCOME";
  onUpdate?: () => void;
  onDelete?: () => void;
  transactionsData?: TransactionI[];
}) => {
  const { transactions } = useTransactionStore();

  const [sortBy, setSortBy] = useState<SortByType>(() => {
    const savedSortBy = localStorage.getItem("transactions-sort-by");
    return (savedSortBy as SortByType) || "date descending";
  });

  const [sortedTransactions, setSortedTransactions] = useState<TransactionI[]>(
    [],
  );

  useEffect(() => {
    localStorage.setItem("transactions-sort-by", sortBy);
  }, [sortBy]);

  useEffect(() => {
    let filtered = transactionsData || transactions;

    if (type == "EXPENSES") {
      filtered = filtered.filter(
        (transaction) => transaction.type === "EXPENSES",
      );
    } else if (type == "INCOME") {
      filtered = filtered.filter(
        (transaction) => transaction.type === "INCOME",
      );
    }

    // Apply sorting
    let sorted = [...filtered];
    if (sortBy === "date ascending") {
      sorted.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    } else if (sortBy === "date descending") {
      sorted.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    } else if (sortBy === "amount ascending") {
      sorted.sort((a, b) => a.amt - b.amt);
    } else if (sortBy === "amount descending") {
      sorted.sort((a, b) => b.amt - a.amt);
    } else if (sortBy === "income") {
      sorted = filtered.filter((t) => t.type === "INCOME");
    } else if (sortBy === "expenses") {
      sorted = filtered.filter((t) => t.type === "EXPENSES");
    }

    setSortedTransactions(sorted);
  }, [sortBy, type, transactions, transactionsData]);

  return sortedTransactions.length === 0 ? (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <p className="text-gray-600 dark:text-gray-300">
        No transactions found. Start by adding an income or expense!
      </p>
    </div>
  ) : (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                onClick={() => {
                  if (sortBy === "date ascending") {
                    setSortBy("date descending");
                  } else if (sortBy === "date descending") {
                    setSortBy("date ascending");
                  } else {
                    setSortBy("date ascending"); // default to ascending if no sort order is set
                  }
                }}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              >
                <div className="flex items-center">
                  <span>Date</span>
                  {/* Show down arrow if sorting is ascending or no sort */}
                  {sortBy === "date ascending" && (
                    <ChevronUpIcon className="inline-block w-4 h-4 ml-2 text-gray-500 dark:text-gray-300" />
                  )}
                  {/* Show up arrow if sorting is descending */}
                  {sortBy === "date descending" && (
                    <ChevronDownIcon className="inline-block w-4 h-4 ml-2 text-gray-500 dark:text-gray-300" />
                  )}
                  {/* Default down arrow when no sorting is applied */}
                  {sortBy !== "date ascending" &&
                    sortBy !== "date descending" && (
                      <ChevronDownIcon className="inline-block w-4 h-4 ml-2 text-gray-500 dark:text-gray-300" />
                    )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Description
              </th>
              <th
                onClick={() => {
                  if (sortBy === "amount ascending") {
                    setSortBy("amount descending");
                  } else if (sortBy === "amount descending") {
                    setSortBy("amount ascending");
                  } else {
                    setSortBy("amount ascending"); // default to ascending if no sort order is set
                  }
                }}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              >
                <div className="flex items-center">
                  <span>Amount</span>
                  {/* Show down arrow if sorting is ascending or no sort */}
                  {sortBy === "amount ascending" && (
                    <ChevronUpIcon className="inline-block w-4 h-4 ml-2 text-gray-500 dark:text-gray-300" />
                  )}
                  {/* Show up arrow if sorting is descending */}
                  {sortBy === "amount descending" && (
                    <ChevronDownIcon className="inline-block w-4 h-4 ml-2 text-gray-500 dark:text-gray-300" />
                  )}
                  {/* Default down arrow when no sorting is applied */}
                  {sortBy !== "amount ascending" &&
                    sortBy !== "amount descending" && (
                      <ChevronDownIcon className="inline-block w-4 h-4 ml-2 text-gray-500 dark:text-gray-300" />
                    )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedTransactions.map((transaction) => (
              <Transaction
                key={transaction.id}
                transaction={transaction}
                onUpdate={() => onUpdate?.()}
                onDelete={() => onDelete?.()}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Transaction = ({
  transaction,
  onUpdate,
  onDelete,
}: {
  transaction: TransactionI;
  onUpdate: () => void;
  onDelete: () => void;
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <tr
        key={transaction.id}
        className={`${transaction.type === "EXPENSES" ? "bg-red-50 dark:bg-red-900/20" : "bg-green-50 dark:bg-green-900/20"}`}
      >
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
          {new Date(transaction.date).toLocaleDateString()}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
          {transaction.description || "No description"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
          ${transaction.amt.toFixed(2)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditOpen(true)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to delete this transaction?",
                  )
                ) {
                  onDelete();
                }
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </td>
      </tr>

      <TransactionEdit
        transaction={transaction}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    </>
  );
};
