const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

interface ApiResponse<T = any> {
  success: boolean;
  msg: string;
  data?: T;
}

const getAuthHeaders = (): HeadersInit => {
  const authData = localStorage.getItem("auth-store");
  if (authData) {
    try {
      const { state } = JSON.parse(authData);
      if (state?.user?.token) {
        return {
          "Content-Type": "application/json",
          Authorization: `Bearer ${state.user.token}`,
        };
      }
    } catch (error) {
      console.error("Error parsing auth data:", error);
    }
  }
  return {
    "Content-Type": "application/json",
  };
};

const handleResponse = async (response: Response) => {
  const data = await response.json();

  if (!response.ok) {
    if (data.msg == "User not found" || response.status == 401 || response.status == 403) {
      localStorage.clear();
    }
    const error = new Error(data.msg || "Request failed");
    (error as any).response = { data, status: response.status };
    throw error;
  }
  return data;
};

export const apiService = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
  },

  register: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
  },

  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  createCategory: async (name: string) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    return handleResponse(response);
  },

  updateCategory: async (categoryId: string, name: string) => {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name }),
    });
    return handleResponse(response);
  },

  deleteCategory: async (categoryId: string) => {
    const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getTransactions: async (page: number = 0) => {
    const response = await fetch(`${API_BASE_URL}/transactions?p=${page}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  getTransactionById: async (transactionId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/transactions/${transactionId}`,
      {
        headers: getAuthHeaders(),
      },
    );
    return handleResponse(response);
  },

  getExpenses: async (page: number = 0) => {
    const response = await fetch(
      `${API_BASE_URL}/transactions/expenses?p=${page}`,
      {
        headers: getAuthHeaders(),
      },
    );
    return handleResponse(response);
  },

  getIncomes: async (page: number = 0) => {
    const response = await fetch(
      `${API_BASE_URL}/transactions/incomes?p=${page}`,
      {
        headers: getAuthHeaders(),
      },
    );
    return handleResponse(response);
  },

  getTransactionsByCategory: async (categoryId: string, page: number = 0) => {
    const response = await fetch(
      `${API_BASE_URL}/transactions?categoryId=${categoryId}&p=${page}`,
      {
        headers: getAuthHeaders(),
      },
    );
    return handleResponse(response);
  },

  getTransactionsByDateRange: async (
    startDate: string,
    endDate: string,
    page: number = 0,
  ) => {
    const response = await fetch(
      `${API_BASE_URL}/transactions?sd=${startDate}&ed=${endDate}&p=${page}`,
      {
        headers: getAuthHeaders(),
      },
    );
    return handleResponse(response);
  },

  createTransaction: async (transaction: {
    amt: number;
    type: "INCOME" | "EXPENSES";
    date: Date;
    categoryId?: string;
    description?: string;
    categoryName?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(transaction),
    });
    return handleResponse(response);
  },

  updateTransaction: async (
    transactionId: string,
    updates: {
      amt?: number;
      type?: "INCOME" | "EXPENSES";
      date?: Date;
      categoryId?: string;
      description?: string;
      categoryName?: string;
    },
  ) => {
    const response = await fetch(
      `${API_BASE_URL}/transactions/${transactionId}`,
      {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      },
    );
    return handleResponse(response);
  },

  deleteTransaction: async (transactionId: string) => {
    const response = await fetch(
      `${API_BASE_URL}/transactions/${transactionId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      },
    );
    return handleResponse(response);
  },

  getDashboardData: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
  getActivityLog: async () => {
    const response = await fetch(`${API_BASE_URL}/dashboard/activity-log`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

export type { ApiResponse };
