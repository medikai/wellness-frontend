//src/modules/layout/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
    fixed top-0 left-0 z-50 h-screen bg-gradient-to-b from-teal-primary to-teal-dark backdrop-blur-md shadow-2xl border-r border-white/10
    transform transition-all duration-300 ease-in-out flex flex-col text-white
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
    ${isCollapsed ? "w-20" : "w-80"}
  `}
      >
        {/* Header */}
        <div className={`flex items-center ${isCollapsed ? "flex-col justify-center space-y-2" : "justify-between"} p-4 flex-shrink-0  shadow-md z-10`}>
          <div className={`flex items-center ${isCollapsed ? "flex-col space-y-2" : "space-x-4"}`}>
            {isCollapsed ? (
              <div className="relative h-12 w-12 drop-shadow-sm p-1">
                <Image
                  src="/images/logo.png"
                  alt="Waylness Icon"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 px-2 py-1">
                <div className="relative h-12 w-12 ">
                  <Image
                    style={{ borderRadius: "10px" }}
                    src="/images/logo.png"
                    alt="Waylness Icon"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="relative h-8 w-32 flex items-center text-white font-bold text-2xl">
                  <p>WALYNESS</p>
                  {/* <Image
                    src="/images/logo_text.png"
                    alt="Waylness"
                    fill
                    className="object-contain object-left"
                    priority
                  /> */}
                </div>
              </div>
            )}
          </div>
          <div className={`flex items-center ${isCollapsed ? "flex-col space-y-2" : "space-x-2"}`}>
            {/* Collapse/Expand Button - Desktop Only */}
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="hidden lg:flex p-2 rounded-xl hover:bg-neutral-100 transition-all duration-200"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                <Icon
                  name={isCollapsed ? "chevronRight" : "chevronLeft"}
                  size="sm"
                  color="#2D7D6B"
                />
              </button>
            )}
            {/* Close Button - Mobile Only */}
            <button
              onClick={onClose}
              className="lg:hidden p-2.5 rounded-xl hover:bg-red-50 text-neutral-500 hover:text-red-500 transition-all duration-200"
            >
              <Icon name="x" size="md" color="#2D7D6B" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-6 space-y-1 overflow-y-auto ${isCollapsed ? "px-2" : "px-4"} scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent`}>
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleItemClick}
              className={`
                flex items-center ${isCollapsed ? "justify-center flex-col" : "justify-between"} px-4 py-3.5 rounded-2xl transition-all duration-200 group relative
                ${item.isActive
                  ? "bg-white text-teal-primary font-bold shadow-lg"
                  : "text-white/80 hover:bg-white/10 hover:text-white hover:shadow-sm"
                }
              `}
              title={isCollapsed ? item.name : undefined}
            >
              <div className={`flex items-center ${isCollapsed ? "flex-col space-y-1" : "space-x-3"}`}>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${item.isActive
                    ? "bg-teal-50"
                    : "bg-white/10 group-hover:bg-white/20"
                    }`}
                >
                  <Icon
                    name={item.icon}
                    size="sm"
                    color={item.isActive ? "#2D7D6B" : "white"}
                  />
                </div>
                {!isCollapsed && (
                  <span className="text-base font-medium">{item.name}</span>
                )}
              </div>

              {!isCollapsed && item.badge && (
                <span className="px-2.5 py-1 text-xs font-bold bg-white/20 text-white border border-white/20 rounded-full animate-pulse shadow-sm">
                  {item.badge}
                </span>
              )}
              {isCollapsed && item.badge && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-400 rounded-full animate-pulse ring-2 ring-teal-dark"></span>
              )}
            </Link>
          ))}
        </nav>

        {/* Footer - Fixed at bottom */}
        <div className={`border-t border-white/10 flex-shrink-0 bg-gradient-to-t from-black/20 to-transparent ${isCollapsed ? "p-2" : "p-4"}`}>
          {/* Bottom Actions - Aligned with navigation */}
          <div className="space-y-1">
            {bottomActions.map((item) => (
              <button
                key={item.name}
                onClick={item.onClick}
                className={`w-full flex items-center ${isCollapsed ? "justify-center flex-col" : "space-x-3"} px-4 py-3.5 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-2xl transition-all duration-200 group shadow-sm hover:shadow-md`}
                title={isCollapsed ? item.name : undefined}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/10 group-hover:bg-white/20 transition-all duration-200">
                  <Icon
                    name={item.icon}
                    size="sm"
                    color="white"
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
