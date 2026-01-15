//src/modules/login/components/LoginForm.tsx
'use client';

import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
import { Button, Icon } from '@/components/ui';
import Link from 'next/link';
import Logo from './Logo';

const LoginForm = () => {
  // const router = useRouter();
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.emailOrPhone.trim()) {
      newErrors.emailOrPhone = 'Email or phone number is required';
    } else if (!/^[\w\.-]+@[\w\.-]+\.\w+$/.test(formData.emailOrPhone) && !/^\d{10}$/.test(formData.emailOrPhone)) {
      newErrors.emailOrPhone = 'Please enter a valid email or 10-digit phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {

      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailOrPhone: formData.emailOrPhone, password: formData.password })
      });
      const json = await r.json();
      console.log(json.profile);
      if (!json.ok) { setErrors({ general: json.error || 'Login failed' }); return; }

      // alert(json.profile.role);
      window.location.assign('/dashboard'); // replaces router.push('/dashboard')

    } catch {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="mb-3 flex flex-col items-start">
        <div className=" pl-1 scale-110">
          <Logo />
        </div>
        <div className="w-full text-left pb-2">
          <h2 className="text-2xl font-bold text-neutral-dark mb-1 ">Welcome Back</h2>
          <p className="text-sm text-neutral-medium ">Enter your credentials to access your account</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="emailOrPhone" className="block text-base font-semibold text-neutral-dark">
            Email or Phone Number
          </label>
          <input
            type="text"
            id="emailOrPhone"
            name="emailOrPhone"
            value={formData.emailOrPhone}
            onChange={handleInputChange}
            className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-teal-primary/20 focus:border-teal-primary transition-all duration-200 ${errors.emailOrPhone ? 'border-red-300' : 'border-neutral-200'
              }`}
            placeholder="e.g. name@example.com or 1234567890"
          />
          {errors.emailOrPhone && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <Icon name="alertCircle" size="sm" className="mr-1" />
              {errors.emailOrPhone}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-base font-semibold text-neutral-dark">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-teal-primary/20 focus:border-teal-primary transition-all duration-200 pr-12 ${errors.password ? 'border-red-300' : 'border-neutral-200'
                }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-teal-primary transition-colors duration-200 p-1"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon name={showPassword ? 'eyeOff' : 'eye'} size="sm" />
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
          <div className="pt-2 text-right">
            <a href="#" className="text-sm text-teal-primary hover:text-teal-dark font-medium hover:underline">
              Forgot password?
            </a>
          </div>
        </div>

        <div className="flex items-center pt-2">
          <input
            type="checkbox"
            id="remember"
            className="h-5 w-5 text-teal-primary focus:ring-teal-primary border-neutral-300 rounded cursor-pointer"
          />
          <label htmlFor="remember" className="ml-3 text-sm text-neutral-600 cursor-pointer">
            Remember me on this device
          </label>
        </div>

        <Button
          type="submit"
          variant="default"
          size="lg"
          className="w-full py-4 text-lg font-bold rounded-xl shadow-lg shadow-teal-500/30 hover:shadow-teal-500/40 transition-all transform active:scale-[0.98]"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-teal-primary hover:text-teal-dark font-semibold">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;