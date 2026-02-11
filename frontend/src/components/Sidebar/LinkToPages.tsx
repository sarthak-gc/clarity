import { SidebarLink } from "@/components/SidebarWrapper";
import { IconBrandTabler, IconChartHistogram } from "@tabler/icons-react";

export interface NavLink {
  label: string;
  href: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const LinkToPages: React.FC = () => {
  const navLinks: NavLink[] = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Activity Log",
      href: "/activity-log",
      icon: (
        <IconChartHistogram className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  return (
    <div className="space-y-1">
      {navLinks.map((link) => (
        <SidebarLink key={link.label} link={link} />
      ))}
    </div>
  );
};

export default LinkToPages;
