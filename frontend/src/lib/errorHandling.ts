// Error types based on backend error structure
export interface ApiError {
  success: false;
  msg: string;
  status: number;
  code?: string;
  details?: any;
}

// Error type mapping for better user messages
export const getErrorMessage = (error: any): string => {
  if (!error.response) {
    if (error.code === "ECONNREFUSED" || error.code === "ERR_NETWORK") {
      return "Network connection failed. Please check your internet connection.";
    }
    return "An unexpected network error occurred. Please try again.";
  }

  // Handle API errors
  const apiError: ApiError = error.response?.data;

  if (!apiError) {
    return "An unexpected error occurred. Please try again.";
  }

  // Specific error messages based on status codes
  switch (apiError.status) {
    case 400:
      return apiError.msg || "Invalid request. Please check your input.";
    case 401:
      return "Authentication failed. Please log in again.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return apiError.msg || "The requested resource was not found.";
    case 409:
      return (
        apiError.msg || "A conflict occurred. The resource may already exist."
      );
    case 422:
      return apiError.msg || "Validation failed. Please check your input.";
    case 500:
      return "Server error occurred. Please try again later.";
    default:
      return apiError.msg || "An error occurred. Please try again.";
  }
};

// Error types for form validation
export const getFormErrorMessage = (field: string, error: string): string => {
  const errorMessages: Record<string, string> = {
    amount: "Please enter a valid amount greater than 0.",
    description: "Please enter a description.",
    categoryId: "Please select a category.",
    categoryName: "Please enter a category name.",
    date: "Please select a valid date.",
    name: "Please enter a valid name.",
  };

  return errorMessages[field] || error;
};

// Error severity for styling
export const getErrorSeverity = (
  status: number,
): "error" | "warning" | "info" => {
  if (status >= 500) return "error";
  if (status >= 400) return "error";
  if (status >= 300) return "warning";
  return "info";
};
