'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui';
import { Icon } from '@/components/ui';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'Book Demo', href: '#cta' },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-md border-b border-neutral-light/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-primary to-teal-dark rounded-xl flex items-center justify-center shadow-md">
              <Icon name="heart" size="sm" color="white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-dark">Waylness</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={handleNavClick}
                className={`text-base font-medium transition-colors duration-200 ${
                  pathname === item.href
                    ? 'text-teal-primary'
                    : 'text-neutral-dark hover:text-teal-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline" size="md">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="md">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-neutral-light/50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon name={mobileMenuOpen ? 'x' : 'menu'} size="md" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-light/50 py-4">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={handleNavClick}
                  className={`text-base font-medium transition-colors duration-200 px-4 py-2 rounded-lg ${
                    pathname === item.href
                      ? 'text-teal-primary bg-teal-light/30'
                      : 'text-neutral-dark hover:text-teal-primary hover:bg-neutral-light/50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 px-4 pt-4 border-t border-neutral-light/50">
                <Link href="/login" onClick={handleNavClick}>
                  <Button variant="outline" size="md" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={handleNavClick}>
                  <Button variant="primary" size="md" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

