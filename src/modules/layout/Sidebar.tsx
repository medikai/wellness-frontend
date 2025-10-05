//src/modules/layout/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui";
import { colors } from "@/design-tokens";
import { useAuth } from "@/contexts/AuthContext";
// Removed inline settings in favor of dedicated Settings page

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
  isAction?: boolean;
  onClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  // No local settings accordion; use Settings page instead

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
    {
      name: "Class Management",
      href: "/class-management",
      icon: "users",
      isActive: pathname === "/class-management",
    },
    {
      name: "Settings",
      href: "/settings",
      icon: "settings",
      isActive: pathname === "/settings",
    },
  ];

  const bottomActions: NavItem[] = [
    {
      name: "Logout",
      href: "#",
      icon: "logOut",
      isAction: true,
      onClick: logout,
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
    fixed top-0 left-0 z-50 h-screen w-64 bg-white shadow-xl border-r border-neutral-light
    transform transition-transform duration-300 ease-in-out flex flex-col
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-light flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-teal-primary rounded-xl flex items-center justify-center">
              <Icon name="heart" size="lg" color="white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-dark">Wellness</h1>
              <p className="text-xs text-neutral-medium">Health Companion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-light transition-colors"
          >
            <Icon name="x" size="md" color={colors.neutral.medium} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleItemClick}
              className={`
                flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                ${
                  item.isActive
                    ? "bg-teal-light text-teal-primary font-semibold shadow-sm"
                    : "text-neutral-dark hover:bg-neutral-light hover:text-teal-primary"
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  item.isActive ? 'bg-teal-primary' : 'bg-neutral-light group-hover:bg-teal-light'
                }`}>
                  <Icon
                    name={item.icon}
                    size="sm"
                    color={
                      item.isActive ? 'white' : colors.neutral.medium
                    }
                  />
                </div>
                <span className="text-base font-medium">{item.name}</span>
              </div>

              {item.badge && (
                <span className="px-2 py-1 text-xs font-semibold bg-orange-primary text-white rounded-full animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}

          {/* Settings moved to dedicated page */}
        </nav>

        {/* Footer - Fixed at bottom */}
        <div className="p-4 border-t border-neutral-light flex-shrink-0">
          <div className="flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-teal-light to-blue-50 mb-3">
            <div className="w-10 h-10 bg-teal-primary rounded-xl flex items-center justify-center">
              <Icon name="user" size="sm" color="white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-neutral-dark truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-teal-primary font-medium truncate">
                Premium Member
              </p>
            </div>
          </div>
          
          {/* Bottom Actions - Aligned with navigation */}
          <div className="space-y-2">
            {bottomActions.map((item) => (
              <button
                key={item.name}
                onClick={item.onClick}
                className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-neutral-medium hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-neutral-light group-hover:bg-red-100">
                  <Icon
                    name={item.icon}
                    size="sm"
                    color={colors.neutral.medium}
                  />
                </div>
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
