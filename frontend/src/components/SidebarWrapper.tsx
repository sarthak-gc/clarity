import {
  Sidebar as UiSidebar,
  SidebarBody as UiSidebarBody,
  SidebarLink as UiSidebarLink,
} from "@/components/ui/sidebar";

export const Sidebar = UiSidebar;
export const SidebarBody = UiSidebarBody;

interface SidebarLinkWrapperProps {
  link: {
    label: string;
    href: string;
    icon: React.ReactNode;
    onClick?: () => void;
  };
  className?: string;
}

export const SidebarLinkWrapper = ({
  link,
  className,
}: SidebarLinkWrapperProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (link.onClick) {
      e.preventDefault();
      link.onClick();
    }
  };

  return (
    <div onClick={handleClick} className={className}>
      <UiSidebarLink
        link={{
          label: link.label,
          href: link.href,
          icon: link.icon,
        }}
      />
    </div>
  );
};

export { SidebarLinkWrapper as SidebarLink };
