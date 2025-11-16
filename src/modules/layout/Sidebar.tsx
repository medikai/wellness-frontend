//src/modules/layout/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui";
import { colors } from "@/design-tokens";
import { useAppSelector } from "@/store/hooks";
import { useAuth } from "@/contexts/AuthContext";
// Removed inline settings in favor of dedicated Settings page

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: string;
  badge?: string;
  isActive?: boolean;
  isAction?: boolean;
  onClick?: () => void;
  roles?: string[]; // Roles that can see this item
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed = false, onToggleCollapse }) => {
  const pathname = usePathname();
  const { logout } = useAuth();
  // Get user and role from Redux store
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role;

  // Define all possible navigation items
  const allNavigationItems: NavItem[] = [
    {
      name: "Home",
      href: "/home",
      icon: "home",
      isActive: pathname === "/home",
      roles: ["student", "coach"], // Available for both roles
    },
    {
      name: "Classes",
      href: "/classes",
      icon: "heart",
      badge: "Live",
      isActive: pathname === "/classes",
      roles: ["student"], // Only for students
    },
    // {
    //   name: "Upcoming Classes",
    //   href: "/classes",
    //   icon: "heart",
    //   badge: "Live",
    //   isActive: pathname === "/classes",
    //   roles: ["student"], // Only for students
    // },
    // {
    //   name: "Upcoming Classes",
    //   href: "/coach/classes",
    //   icon: "heart",
    //   badge: "Live",
    //   isActive: pathname === "/classes",
    //   roles: ["coach"], // Only for students
    // },
    {
      name: "Game",
      href: "/game",
      icon: "gamepad",
      isActive: pathname === "/game",
      roles: ["student"], // Only for students
    },
    {
      name: "Progress",
      href: "/progress",
      icon: "chart",
      isActive: pathname === "/progress",
      roles: ["student"], // Only for students
    },
    {
      name: "Reports",
      href: "/reports",
      icon: "fileText",
      isActive: pathname === "/reports",
      roles: ["student"], // Only for students
    },
    {
      name: "Community",
      href: "/community",
      icon: "users",
      isActive: pathname === "/community",
      roles: ["student"], // Only for students
    },
    {
      name: "Help & Support",
      href: "/help",
      icon: "helpCircle",
      isActive: pathname === "/help",
      roles: ["student"], // Only for students
    },
    {
      name: "Class Management",
      href: "/class-management",
      icon: "users",
      isActive: pathname === "/class-management",
      roles: ["coach"], // Only for coaches
    },
  ];

  // Filter navigation items based on user role
  const navigationItems: NavItem[] = allNavigationItems.filter((item) => {
    if (!userRole) return false; // Hide navigation if role is not available
    return item.roles?.includes(userRole);
  });

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
          className="fixed inset-0  bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
    fixed top-0 left-0 z-50 h-screen bg-white/95 backdrop-blur-sm shadow-lg border-r border-neutral-light/50
    transform transition-all duration-300 ease-in-out flex flex-col
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
    ${isCollapsed ? "w-20" : "w-64"}
  `}
      >
        {/* Header */}
        <div className={`flex items-center ${isCollapsed ? "flex-col justify-center space-y-2" : "justify-between"} p-4 border-b border-neutral-light/50 flex-shrink-0`}>
          <div className={`flex items-center ${isCollapsed ? "flex-col space-y-2" : "space-x-4"}`}>
            <div className="w-12 h-12 bg-gradient-to-br from-teal-primary to-teal-dark rounded-2xl flex items-center justify-center shadow-lg">
              <Icon name="heart" size="lg" color="white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-neutral-dark">waylness</h1>
                <p className="text-sm text-teal-primary font-medium">
                  Health Companion
                </p>
              </div>
            )}
          </div>
          <div className={`flex items-center ${isCollapsed ? "flex-col space-y-2" : "space-x-2"}`}>
            {/* Collapse/Expand Button - Desktop Only */}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex p-2 rounded-xl hover:bg-neutral-light/50 transition-all duration-200"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Icon 
                  name={isCollapsed ? "chevronRight" : "chevronLeft"} 
                  size="sm" 
                  color={colors.neutral.medium} 
                />
              </button>
            )}
            {/* Close Button - Mobile Only */}
            <button
              onClick={onClose}
              className="lg:hidden p-2.5 rounded-xl hover:bg-red-100 hover:text-red-600 transition-all duration-200"
            >
              <Icon name="x" size="md" color="#6B7280" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-6 space-y-1 overflow-y-auto ${isCollapsed ? "px-2" : "px-4"}`}>
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleItemClick}
              className={`
                flex items-center ${isCollapsed ? "justify-center flex-col" : "justify-between"} px-4 py-3.5 rounded-2xl transition-all duration-200 group relative
                ${
                  item.isActive
                    ? "bg-gradient-to-r from-teal-light to-blue-50 text-teal-primary font-semibold shadow-md border border-teal-light/50"
                    : "text-neutral-dark hover:bg-neutral-light/50 hover:text-teal-primary hover:shadow-sm"
                }
              `}
              title={isCollapsed ? item.name : undefined}
            >
              <div className={`flex items-center ${isCollapsed ? "flex-col space-y-1" : "space-x-3"}`}>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
                    item.isActive
                      ? "bg-teal-primary shadow-sm"
                      : "bg-neutral-light group-hover:bg-teal-light group-hover:shadow-sm"
                  }`}
                >
                  <Icon
                    name={item.icon}
                    size="sm"
                    color={item.isActive ? "white" : colors.neutral.medium}
                  />
                </div>
                {!isCollapsed && (
                  <span className="text-base font-medium">{item.name}</span>
                )}
              </div>

              {!isCollapsed && item.badge && (
                <span className="px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-orange-primary to-red-500 text-white rounded-full animate-pulse shadow-sm">
                  {item.badge}
                </span>
              )}
              {isCollapsed && item.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-orange-primary to-red-500 rounded-full animate-pulse"></span>
              )}
            </Link>
          ))}

          {/* Text Size Control */}
          {/* <div className="px-4 py-2">
            <TextSizeControl variant="sidebar" />
          </div> */}
        </nav>

        {/* Footer - Fixed at bottom */}
        <div className={`border-t border-neutral-light/50 flex-shrink-0 bg-gradient-to-t from-neutral-light/20 to-transparent ${isCollapsed ? "p-2" : "p-4"}`}>
          {/* Bottom Actions - Aligned with navigation */}
          <div className="space-y-1">
            {bottomActions.map((item) => (
              <button
                key={item.name}
                onClick={item.onClick}
                className={`w-full flex items-center ${isCollapsed ? "justify-center flex-col" : "space-x-3"} px-4 py-3.5 text-sm text-neutral-medium hover:text-white hover:bg-gradient-to-r from-teal-light/10 to-blue-50 rounded-2xl transition-all duration-200 group shadow-sm hover:shadow-md`}
                title={isCollapsed ? item.name : undefined}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-neutral-light group-hover:bg-white/20 transition-all duration-200">
                  <Icon
                    name={item.icon}
                    size="sm"
                    color={colors.neutral.medium}
                  />
                </div>
                {!isCollapsed && (
                  <span className="font-semibold">{item.name}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
