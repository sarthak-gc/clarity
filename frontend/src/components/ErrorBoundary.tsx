import React from "react";

interface ErrorBoundaryProps {
  error: string;
  onLogout: () => void;
}

export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  error,
  onLogout,
}) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-neutral-50">
      <div className="text-center space-y-4 max-w-md mx-auto p-6">
        <div className="bg-neutral-100 rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center">
          <svg
            className="h-8 w-8 text-neutral-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-neutral-800 mb-2">
            Something went wrong
          </h2>
          <p className="text-neutral-600 text-sm">{error}</p>
        </div>
        <button
          onClick={onLogout}
          className="px-6 py-2 bg-neutral-600 text-white rounded-md hover:bg-neutral-700 transition-colors font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ErrorBoundary;
