import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import { Login } from "@/pages/Login";
import PrivateRoute from "./PrivateRoute";
import { Register } from "@/pages/Register";
import { Dashboard } from "@/pages/Dashboard";
import { CategoryTransactions } from "@/pages/CategoryTransactions";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Category } from "@/pages/Category";
import { ActivityLog } from "@/pages/ActivityLog";
import { Expenses } from "@/pages/Expenses";
import { Incomes } from "@/pages/Incomes";
const routes = [
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "categories/:id",
        element: <CategoryTransactions />,
      },
      {
        path: "categories",
        element: <Category />,
      },
      {
        path: "activity-log",
        element: <ActivityLog />,
      },
      { path: "expenses", element: <Expenses /> },
      { path: "incomes", element: <Incomes /> },
    ],
  },
  {
    path: "*",
    element: <>404 Page Not Found</>,
  },
];

const Routes: React.FC = () => {
  const router = createBrowserRouter(routes);

  return <RouterProvider router={router} />;
};

export default Routes;
