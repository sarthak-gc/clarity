import { SidebarLink } from "@/components/SidebarWrapper";
import { IconCategory } from "@tabler/icons-react";
import { useSidebar } from "../ui/sidebar";
import type { Category } from "@/types/all";

interface CategoriesProps {
  categories: Category[];
  loading: boolean;
}

export const Categories: React.FC<CategoriesProps> = ({
  categories,
  loading,
}) => {
  const { open } = useSidebar();
  if (loading) {
    return (
      <div className="space-y-1">
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {categories.map((category) => (
        <SidebarLink
          className={open ? "text-sm px-5" : "text-sm px-5 hidden"}
          key={category.id}
          link={{
            label: category.name,
            href: `/categories/${category.id}`,
            icon: (
              <IconCategory className="h-3 w-3 shrink-0 text-neutral-700 dark:text-neutral-200" />
            ),
          }}
        />
      ))}
    </div>
  );
};
