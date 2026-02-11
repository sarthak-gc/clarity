import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/AuthStore";
import { Categories } from "@/components/Sidebar/Categories";
import LinkToPages from "@/components/Sidebar/LinkToPages";
import UserSection from "@/components/Sidebar/UserSection";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useEffect, useState } from "react";
import { SidebarLink } from "@/components/ui/sidebar";
import { IconLayoutGrid } from "@tabler/icons-react";
import { Outlet } from "react-router-dom";
import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";
import { useCategoryStore } from "@/store/CategoryStore";
import { apiService } from "@/lib/api";
import { getErrorMessage } from "@/lib/errorHandling";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = () => {
  const { logout, user } = useAuthStore();
  const [error, setError] = useState("");
  const { categories, setCategories } = useCategoryStore();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    if (!user) return;

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await apiService.getCategories();
        const data = response.data

        setCategories(data.categories);
      } catch (error) {
        setError(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [setCategories, user]);

  if (error) {
    return <ErrorBoundary error={error} onLogout={handleLogout} />;
  }

  if (!user) {
    return <ErrorBoundary error="User not found" onLogout={handleLogout} />;
  }

  return (
    <div className="h-screen flex">
      <Sidebar>
        <SidebarBody>
          <div className="space-y-6">
            <LinkToPages />
            <div className="border-t border-neutral-200 dark:border-red-700 pt-6">
              <SidebarLink
                link={{
                  label: "Categories",
                  href: "/categories",
                  icon: (
                    <IconLayoutGrid className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                  ),
                }}
              />
              <Categories categories={categories} loading={loading} />
              <SidebarLink
                link={{
                  label: "Expenses",
                  href: "/expenses",
                  icon: (
                    <BanknoteArrowDown className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                  ),
                }}
              />
              <SidebarLink
                link={{
                  label: "Incomes",
                  href: "/incomes",
                  icon: (
                    <BanknoteArrowUp className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                  ),
                }}
              />
            </div>
          </div>
          <div className="border-t border-neutral-200 dark:border-red-700 pt-6">
            <UserSection />
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 overflow-auto md:ml-0">
        <Outlet />
      </main>
    </div>
  );
};
