//src/modules/register-coach/components/CoachRegisterForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Icon } from '@/components/ui';
import Link from 'next/link';

const CoachRegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[\w\.-]+@[\w\.-]+\.\w+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const r = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          password: formData.password,
          user_type: 'coach' // Add coach type to distinguish from regular users
        })
      });
      const json = await r.json();
      if (!json.ok) { setErrors({ general: json.error || 'Registration failed' }); return; }

      router.push('/');

    } catch {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-dark mb-1">Join as a Coach</h2>
        <p className="text-sm text-neutral-medium">Enter your credentials to start your coaching journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-neutral-dark mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-primary focus:border-teal-primary transition-all duration-200 ${errors.name ? 'border-red-300' : 'border-neutral-200'
              }`}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-neutral-dark mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-primary focus:border-teal-primary transition-all duration-200 ${errors.email ? 'border-red-300' : 'border-neutral-200'
              }`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-neutral-dark mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-primary focus:border-teal-primary transition-all duration-200 ${errors.phone ? 'border-red-300' : 'border-neutral-200'
              }`}
            placeholder="Enter your 10-digit phone number"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
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
              placeholder="Create a password (min 6 characters)"
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
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-neutral-dark mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-primary focus:border-teal-primary transition-all duration-200 pr-10 ${errors.confirmPassword ? 'border-red-300' : 'border-neutral-200'
                }`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <Icon name="eye" size="sm" />
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="terms"
            className="h-4 w-4 text-teal-primary focus:ring-teal-primary border-neutral-300 rounded"
            required
          />
          <label htmlFor="terms" className="ml-2 text-sm text-neutral-600">
            I agree to the{' '}
            <a href="#" className="text-teal-primary hover:text-teal-dark font-semibold">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-teal-primary hover:text-teal-dark font-semibold">
              Privacy Policy
            </a>
          </label>
        </div>

        <Button
          type="submit"
          variant="default"
          size="lg"
          className="w-full py-3 text-base font-semibold rounded-lg"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Coach Account...' : 'Create Coach Account'}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-600">
          Already have an account?{' '}
          <Link href="/login" className="text-teal-primary hover:text-teal-dark font-semibold">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CoachRegisterForm;