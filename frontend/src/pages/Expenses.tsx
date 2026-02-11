import { useAuthStore } from "@/store/AuthStore";
import { useEffect, useState } from "react";
import type { TransactionI, TransactionToAdd } from "@/types/all";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useCategoryStore } from "@/store/CategoryStore";
import { Transactions } from "@/components/Transactions";
import { TrendingDown, Minus, AlertCircle, DollarSign } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { getErrorMessage, getFormErrorMessage } from "@/lib/errorHandling";
import { apiService } from "@/lib/api";

export const Expenses = () => {
  const [expenses, setExpenses] = useState<TransactionI[]>([]);
  const [expense, setExpense] = useState<TransactionToAdd>({
    amt: 0,
    type: "EXPENSES",
    categoryId: "",
    description: "",
    date: new Date(),
  });
  const { categories, addCategory, removeCategory } = useCategoryStore();
  const [selectedCategory, setSelectedCategory] = useState("");
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const getExpenses = async () => {
      setLoading(true);
      try {
        const response = await apiService.getExpenses();
        const data = response.data as { transactions?: TransactionI[] };
        setExpenses(data.transactions || []);
      } catch (error) {
        setError(getErrorMessage(error))
      } finally {
        setLoading(false);
      }
    };
    getExpenses();
  }, [user]);

  const handleAddExpense = async () => {
    if (!expense.amt || expense.amt <= 0) {
      setError(getFormErrorMessage("amount", "Please enter a valid amount"));
      return;
    }

    if (!expense.description?.trim()) {
      setError(
        getFormErrorMessage("description", "Please enter a description"),
      );
      return;
    }

    if (!expense.categoryId) {
      setError(getFormErrorMessage("categoryId", "Please select a category"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiService.createTransaction({
        amt: expense.amt,
        type: "EXPENSES",
        description: expense.description,
        date: expense.date,
        categoryId: expense.categoryId,
        categoryName: selectedCategory,
      });

      const data = response.data as { transaction: TransactionI };
      setExpenses([...expenses, data.transaction]);
      setExpense({
        amt: 0,
        type: "EXPENSES",
        categoryId: "",
        description: "",
        date: new Date(),
      });
      setSelectedCategory("");
      removeCategory("added-new-category");
      if (data.transaction?.categoryId && selectedCategory.trim()) {
        addCategory({
          name: selectedCategory,
          id: data.transaction.categoryId,
        });
      }
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };
  const handleTransactionUpdate = () => {
    getExpenses();
  };

  const handleTransactionDelete = () => {
    getExpenses();
  };

  const handleAddCategory = async () => {
    const categoryName = prompt("Enter category name:");
    setSelectedCategory(categoryName || "");
    if (categoryName) {
      addCategory({ name: categoryName.trim(), id: "added-new-category" });
    }
  };

  const getExpenses = async () => {
    setLoading(true);
    try {
      const response = await apiService.getExpenses();
      const data = response.data as { transactions?: TransactionI[] };
      setExpenses(data.transactions || []);
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Expense Management
          </h1>
          <p className="text-gray-500 mt-1">Track and manage your expenses</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-red-100 text-red-700">
            {expenses.length} expenses
          </Badge>
          <div className="text-sm text-gray-500 flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>
              Total: ${expenses.reduce((sum, e) => sum + e.amt, 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Minus className="w-5 h-5 text-red-600" />
            <span>Add New Expense</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={expense.amt}
                onChange={(e) =>
                  setExpense({
                    ...expense,
                    amt: parseFloat(e.target.value) || 0,
                  })
                }
                required
                className="border-red-200 focus:border-red-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                placeholder="Enter description"
                value={expense.description || ""}
                onChange={(e) =>
                  setExpense({ ...expense, description: e.target.value })
                }
                required
                className="border-red-200 focus:border-red-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={expense.categoryId || ""}
                onValueChange={(value) => {
                  if (value == "new-category") {
                    handleAddCategory();
                    setExpense({
                      ...expense,
                      categoryId: "added-new-category",
                    });
                    return;
                  }
                  return setExpense({ ...expense, categoryId: value });
                }}
              >
                <SelectTrigger className="border-red-200 focus:border-red-500">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                  <SelectItem
                    value="new-category"
                    className="text-blue-600 font-medium"
                  >
                    + Add New Category
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <div className="border border-red-200 rounded-lg p-2">
                <Calendar
                  mode="single"
                  selected={expense.date}
                  onSelect={(date) =>
                    setExpense({ ...expense, date: date || new Date() })
                  }
                  className="w-full text-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleAddExpense}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? "Adding..." : "Add Expense"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Expenses Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Expenses</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Your latest expense transactions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-4 h-4 text-red-600" />
            <span className="text-sm text-gray-500">
              {expenses.length} total
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Transactions
            type="EXPENSES"
            onUpdate={handleTransactionUpdate}
            onDelete={handleTransactionDelete}
            transactionsData={expenses}
          />
        </CardContent>
      </Card>
    </div>
  );
};
