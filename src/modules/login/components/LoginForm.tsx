//src/modules/login/components/LoginForm.tsx
'use client';

import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
import { Button, Icon } from '@/components/ui';
import Link from 'next/link';

const LoginForm = () => {
  // const router = useRouter();
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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

      alert(json.profile.role);
      window.location.assign('/dashboard'); // replaces router.push('/dashboard')

    } catch {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-dark mb-1">Welcome Back</h2>
        <p className="text-sm text-neutral-medium">Enter your credentials to access your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        <div>
          <label htmlFor="emailOrPhone" className="block text-sm font-semibold text-neutral-dark mb-1">
            Email or Phone Number
          </label>
          <input
            type="text"
            id="emailOrPhone"
            name="emailOrPhone"
            value={formData.emailOrPhone}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-primary focus:border-teal-primary transition-all duration-200 ${errors.emailOrPhone ? 'border-red-300' : 'border-neutral-200'
              }`}
            placeholder="Enter your email or phone number"
          />
          {errors.emailOrPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.emailOrPhone}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-semibold text-neutral-dark mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-primary focus:border-teal-primary transition-all duration-200 pr-10 ${errors.password ? 'border-red-300' : 'border-neutral-200'
                }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <Icon name="eye" size="sm" />
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
          <div className="mt-1 text-right">
            <a href="#" className="text-xs text-teal-primary hover:text-teal-dark font-medium">
              Forgot password?
            </a>
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            className="h-4 w-4 text-teal-primary focus:ring-teal-primary border-neutral-300 rounded"
          />
          <label htmlFor="remember" className="ml-2 text-sm text-neutral-600">
            Remember me
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full py-3 text-base font-semibold rounded-lg"
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