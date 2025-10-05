"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui";
import { colors } from "@/design-tokens";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: string;
  isActive?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigationItems: NavItem[] = [
    {
      name: "Home",
      href: "/",
      icon: "home",
      isActive: pathname === "/",
    },
    {
      name: "Classes",
      href: "/classes",
      icon: "heart",
      badge: "Live",
      isActive: pathname === "/classes",
    },
    {
      name: "Game",
      href: "/game",
      icon: "gamepad",
      isActive: pathname === "/game",
    },
    {
      name: "Progress",
      href: "/progress",
      icon: "chart",
      isActive: pathname === "/progress",
    },
    {
      name: "Reports",
      href: "/reports",
      icon: "fileText",
      isActive: pathname === "/reports",
    },
    {
      name: "Community",
      href: "/community",
      icon: "users",
      isActive: pathname === "/community",
    },
    {
      name: "Help & Support",
      href: "/help",
      icon: "helpCircle",
      isActive: pathname === "/help",
    },
  ];

  const handleItemClick = () => {
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
    fixed top-0 left-0 z-50 h-screen w-64 bg-white shadow-lg 
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-light">
          <div className="flex items-center space-x-2">
            <Icon name="heart" size="lg" color={colors.teal.primary} />
            <h1 className="text-xl font-bold text-neutral-dark">Health++</h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-light transition-colors"
          >
            <Icon name="x" size="md" color={colors.neutral.medium} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleItemClick}
              className={`
                flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group
                ${
                  item.isActive
                    ? "bg-teal-light text-teal-primary font-medium"
                    : "text-neutral-dark hover:bg-neutral-light hover:text-teal-primary"
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <Icon
                  name={item.icon}
                  size="md"
                  color={
                    item.isActive ? colors.teal.primary : colors.neutral.medium
                  }
                />
                <span className="text-lg font-medium">{item.name}</span>
              </div>

              {item.badge && (
                <span className="px-2 py-1 text-xs font-medium bg-orange-primary text-white rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-light">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-neutral-light">
            <div className="w-8 h-8 bg-teal-primary rounded-full flex items-center justify-center">
              <Icon name="user" size="sm" color="white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-medium text-neutral-dark truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-neutral-medium truncate">
                Premium Member
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full mt-2 flex items-center space-x-2 px-3 py-2 text-sm text-neutral-medium hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Icon name="logOut" size="sm" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
