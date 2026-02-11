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
import {
  TrendingDown,
  AlertCircle,
  DollarSign,
  Plus,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { getErrorMessage, getFormErrorMessage } from "@/lib/errorHandling";
import { apiService } from "@/lib/api";

export const Incomes = () => {
  const [incomes, setIncomes] = useState<TransactionI[]>([]);
  const [income, setIncome] = useState<TransactionToAdd>({
    amt: 0,
    type: "INCOME",
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
    const getIncomes = async () => {
      setLoading(true);
      try {
        const response = await apiService.getIncomes();
        const data = response.data as { transactions?: TransactionI[] };
        setIncomes(data.transactions || []);
      } catch (error) {
        setError(getErrorMessage(error))
      } finally {
        setLoading(false);
      }
    };
    getIncomes();
  }, [user]);

  const handleAddIncome = async () => {
    if (!income.amt || income.amt <= 0) {
      setError(getFormErrorMessage("amount", "Please enter a valid amount"));
      return;
    }

    if (!income.description?.trim()) {
      setError(
        getFormErrorMessage("description", "Please enter a description"),
      );
      return;
    }

    if (!income.categoryId) {
      setError(getFormErrorMessage("categoryId", "Please select a category"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiService.createTransaction({
        amt: income.amt,
        type: "INCOME",
        description: income.description,
        date: income.date,
        categoryId: income.categoryId,
        categoryName: selectedCategory,
      });

      const data = response.data as { transaction: TransactionI };
      setIncomes([...incomes, data.transaction]);
      setIncome({
        amt: 0,
        type: "INCOME",
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
    getIncomes();
  };

  const handleTransactionDelete = () => {
    getIncomes();
  };

  const handleAddCategory = async () => {
    const categoryName = prompt("Enter category name:");
    setSelectedCategory(categoryName || "");
    if (categoryName) {
      addCategory({ name: categoryName.trim(), id: "added-new-category" });
    }
  };

  const getIncomes = async () => {
    setLoading(true);
    try {
      const response = await apiService.getIncomes();
      const data = response.data as { transactions?: TransactionI[] };
      setIncomes(data.transactions || []);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Income Management
          </h1>
          <p className="text-gray-500 mt-1">Track and manage your incomes</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {incomes.length} incomes
          </Badge>
          <div className="text-sm text-gray-500 flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>
              Total: ${incomes.reduce((sum, e) => sum + e.amt, 0).toFixed(2)}
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

      <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-green-600" />
            <span>Add New Income</span>
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
                value={income.amt}
                onChange={(e) =>
                  setIncome({
                    ...income,
                    amt: parseFloat(e.target.value) || 0,
                  })
                }
                required
                className="border-green-200 focus:border-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                placeholder="Enter description"
                value={income.description || ""}
                onChange={(e) =>
                  setIncome({ ...income, description: e.target.value })
                }
                required
                className="border-green-200 focus:border-green-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={income.categoryId || ""}
                onValueChange={(value) => {
                  if (value == "new-category") {
                    handleAddCategory();
                    setIncome({
                      ...income,
                      categoryId: "added-new-category",
                    });
                    return;
                  }
                  return setIncome({ ...income, categoryId: value });
                }}
              >
                <SelectTrigger className="border-green-200 focus:border-green-500">
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
              <div className="border border-green-200 rounded-lg p-2">
                <Calendar
                  mode="single"
                  selected={income.date}
                  onSelect={(date) =>
                    setIncome({ ...income, date: date || new Date() })
                  }
                  className="w-full text-sm"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              onClick={handleAddIncome}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? "Adding..." : "Add Income"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Incomes Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Incomes</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Your latest income transactions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-500">
              {incomes.length} total
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Transactions
            type="INCOME"
            onUpdate={handleTransactionUpdate}
            onDelete={handleTransactionDelete}
            transactionsData={incomes}
          />
        </CardContent>
      </Card>
    </div>
  );
};
