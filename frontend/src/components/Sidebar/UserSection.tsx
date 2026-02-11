import { SidebarLink } from "@/components/SidebarWrapper";
import { IconArrowLeft } from "@tabler/icons-react";
import { useAuthStore } from "@/store/AuthStore";
import type { NavLink } from "./LinkToPages";

const UserSection: React.FC = () => {
  const { logout } = useAuthStore();

  const userLinks: NavLink[] = [
    {
      label: "Logout",
      href: "#",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];
  const handleLogout = () => {
    logout();
  };

  return (
    <div className="space-y-1">
      {userLinks.map((link) => (
        <SidebarLink
          key={link.label}
          link={{
            ...link,
            onClick: link.label === "Logout" ? handleLogout : undefined,
          }}
        />
      ))}
    </div>
  );
};

export default UserSection;
