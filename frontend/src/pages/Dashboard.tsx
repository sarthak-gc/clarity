import { useAuthStore } from "@/store/AuthStore";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useEffect, useState } from "react";
import type { DashboardI } from "@/types/all";
import { TransactionPieChart } from "@/components/charts/PieChart";
import { useLineGraphStore } from "@/store/LineGraphStore";
import { useTransactionStore } from "@/store/TransactionStore";
import { Loading } from "../components/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CreditCard,
} from "lucide-react";
import type { TransactionI } from "@/types/all";
import { apiService } from "@/lib/api";
import { getErrorMessage } from "@/lib/errorHandling";
export const Dashboard: React.FC = () => {
  const { logout, user } = useAuthStore();
  const { setLineGraphData } = useLineGraphStore();
  const { setTransactions } = useTransactionStore();
  const [loading, setLoading] = useState(false);
  const [pieChartData, setPieChartData] = useState([
    { name: "Income", value: 0 },
    { name: "Expenses", value: 0 },
  ]);
  const [error,setError] = useState("")
  const [chartTitle, setChartTitle] = useState<
    "Income vs Expenses" | "Category wise expenses" | "Category wise income"
  >("Income vs Expenses");
  const [dashboardData, setDashboardData] = useState<DashboardI>({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    recentTransactions: [],
  });
  const [categoryTransactions, setCategoryTransactions] = useState<
    Record<string, TransactionI[]>
  >({});
  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const getDashboard = async () => {
      setLoading(true);
      try{
      const response = await apiService.getDashboardData();
const data = response.data

      setDashboardData(data.dashboardData);
      setTransactions(data.dashboardData.recentTransactions);
      const { totalIncome, totalExpenses } = data.dashboardData;
      setPieChartData([
        { name: "Income", value: totalIncome },
        { name: "Expenses", value: totalExpenses },
      ]);
      setLineGraphData(data.dashboardData.lineGraphData);

      const grouped = data.dashboardData.recentTransactions.reduce(
        (acc: Record<string, TransactionI[]>, transaction: TransactionI) => {
          const categoryName = transaction.category?.name || "Uncategorized";
          if (!acc[categoryName]) {
            acc[categoryName] = [];
          }
          acc[categoryName].push(transaction);
          return acc;
        },
        {} as Record<string, TransactionI[]>,
      );
      setCategoryTransactions(grouped);
    } catch (error) {
      setError(getErrorMessage(error))
    }finally{
      setLoading(false)
    }
  };
  getDashboard();
  }, [setLineGraphData, user?.token]);
  if (!user) {
    return <ErrorBoundary error="User not found" onLogout={handleLogout} />;
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    console.log(error)
    return <ErrorBoundary error={error} onLogout={handleLogout} />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getCategoryTotal = (transactions: TransactionI[]) => {
    return transactions.reduce((sum, transaction) => sum + transaction.amt, 0);
  };

  const getIncomeForCategoryWiseData = () => {
    const categoryData: Record<string, number> = {};
    Object.entries(categoryTransactions).forEach(
      ([categoryName, transactions]) => {
        const incomes = transactions.filter((t) => t.type === "INCOME");
        if (incomes.length > 0) {
          categoryData[categoryName] = getCategoryTotal(incomes);
        }
      },
    );
    return Object.entries(categoryData).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getExpensesForCategoryWiseData = () => {
    const categoryData: Record<string, number> = {};
    Object.entries(categoryTransactions).forEach(
      ([categoryName, transactions]) => {
        const expenses = transactions.filter((t) => t.type === "EXPENSES");
        if (expenses.length > 0) {
          categoryData[categoryName] = getCategoryTotal(expenses);
        }
      },
    );
    return Object.entries(categoryData).map(([name, value]) => ({
      name,
      value,
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Welcome back! Here's your financial overview
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Last 90 days</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Total Income
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {formatCurrency(dashboardData.totalIncome)}
            </div>
            <p className="text-xs text-green-600 mt-1 flex items-center">
              <ArrowUpRight className="w-3 h-3 mr-1" />
              Income this period
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">
              {formatCurrency(dashboardData.totalExpenses)}
            </div>
            <p className="text-xs text-red-600 mt-1 flex items-center">
              <ArrowDownRight className="w-3 h-3 mr-1" />
              Expenses this period
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Net Balance
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${dashboardData.netBalance >= 0 ? "text-blue-900" : "text-red-900"}`}
            >
              {formatCurrency(dashboardData.netBalance)}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              {dashboardData.netBalance >= 0
                ? "Positive balance"
                : "Negative balance"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">{chartTitle}</CardTitle>
            <div className="flex space-x-1">
              <button
                onClick={() => setChartTitle("Income vs Expenses")}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  chartTitle === "Income vs Expenses"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setChartTitle("Category wise expenses")}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  chartTitle === "Category wise expenses"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Expenses
              </button>
              <button
                onClick={() => setChartTitle("Category wise income")}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  chartTitle === "Category wise income"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Income
              </button>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center">
            <TransactionPieChart
              data={
                chartTitle === "Income vs Expenses"
                  ? pieChartData
                  : chartTitle === "Category wise expenses"
                    ? getExpensesForCategoryWiseData()
                    : getIncomeForCategoryWiseData()
              }
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Recent Transactions</CardTitle>
              <p className="text-sm text-gray-500 mt-1">Grouped by category</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 max-h-96 overflow-y-auto">
            {Object.entries(categoryTransactions).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No recent transactions</p>
              </div>
            ) : (
              Object.entries(categoryTransactions).map(
                ([categoryName, transactions]) => (
                  <div
                    key={categoryName}
                    className="border-l-4 border-blue-500 pl-4 py-2"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-800">
                        {categoryName}
                      </h4>
                      <span className="text-sm text-gray-600">
                        {formatCurrency(getCategoryTotal(transactions))}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex justify-between items-center text-sm"
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                transaction.type === "INCOME"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            />
                            <span className="text-gray-700">
                              {transaction.description}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`font-medium ${
                                transaction.type === "INCOME"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === "INCOME" ? "+" : "-"}
                              {formatCurrency(transaction.amt)}
                            </span>
                            <span className="text-gray-500 text-xs">
                              {new Date(transaction.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ),
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
