import { TransactionLineChart } from "@/components/charts/LineChart";
import { useLineGraphStore } from "@/store/LineGraphStore";
import { useTransactionStore } from "@/store/TransactionStore";
import { Transactions } from "@/components/Transactions";
import { useAuthStore } from "@/store/AuthStore";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Activity } from "lucide-react";
import { apiService } from "@/lib/api";

export const ActivityLog = () => {
  const { lineGraphData,setLineGraphData } = useLineGraphStore();
  const { setTransactions, transactions, addTransactions } =
    useTransactionStore();
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  useEffect(()=>{
   const fetchLineGraphData =async ()=>{
      try{
   const response =  await apiService.getActivityLog()
   const data = response.data.lineGraphData
   setLineGraphData(data)
    }catch{

    }
    }
    fetchLineGraphData()
  },[])
  const getTransactions = async (
    page: number = 0,
    startDate?: string,
    endDate?: string,
  ) => {
    if (!user) return;
    setLoading(true);
    try {
      let response;
      if (startDate && endDate) {
        response = await apiService.getTransactionsByDateRange(
          startDate,
          endDate,
          page,
        );
      } else {
        response = await apiService.getTransactions(page);
      }

      const data = response.data as { transactions?: any[] };
      if (page === 0) {
        setTransactions(data.transactions || []);
      } else {
        addTransactions(data.transactions || []);
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTransactions(currentPage);
  }, [currentPage, user]);

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleTransactionUpdate = () => {
    alert("todo");
  };

  const handleTransactionDelete = () => {
    alert("todo");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-gray-500 mt-1">
            Track your financial activity over time
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>All time</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Financial Trends</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {
            lineGraphData.length > 0 ? (
              <TransactionLineChart data={lineGraphData} />
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )
          }
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">All Transactions</CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Complete transaction history
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {transactions.length} transactions
          </div>
        </CardHeader>
        <CardContent>
          <Transactions
            onUpdate={handleTransactionUpdate}
            onDelete={handleTransactionDelete}
          />
          {transactions.length % 10 === 0 && transactions.length > 0 && (
            <div className="flex justify-center mt-4">
              <Button onClick={handleLoadMore} disabled={loading}>
                {loading ? "Loading..." : "Load More Transactions"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
