'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Icon } from '@/components/ui';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user data in localStorage (in real app, this would be handled by your backend)
      localStorage.setItem('user', JSON.stringify({
        email: formData.emailOrPhone.includes('@') ? formData.emailOrPhone : null,
        phone: !formData.emailOrPhone.includes('@') ? formData.emailOrPhone : null,
        name: 'Mary Johnson', // This would come from your backend
        isAuthenticated: true
      }));
      
      router.push('/');
    } catch {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex overflow-hidden">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-1 py-1">
        <div className="w-3/4 max-w-4xl">
          {/* Logo */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="heart" size="lg" color="#4CAF9D" />
              <h1 className="text-2xl font-bold text-neutral-dark">Health++</h1>
            </div>
          </div>

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
                  className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-primary focus:border-teal-primary transition-all duration-200 ${
                    errors.emailOrPhone ? 'border-red-300' : 'border-neutral-200'
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
                    className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-primary focus:border-teal-primary transition-all duration-200 pr-10 ${
                      errors.password ? 'border-red-300' : 'border-neutral-200'
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
        </div>
      </div>

      {/* Right Side - Health Dashboard Preview */}
      <div className="flex-1 bg-gradient-to-br from-teal-500 to-teal-600 p-6 flex items-center justify-center relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-32 right-10 w-28 h-28 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10 text-white">
          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-3">Your Health Journey Starts Here</h2>
            <p className="text-lg text-teal-100">Track your wellness, join classes, and achieve your health goals</p>
          </div>

          {/* Health Dashboard Mockup */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3">Today&apos;s Progress</h3>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-xl font-bold">8.5</div>
                <div className="text-xs text-teal-100">Hours Active</div>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <div className="text-xl font-bold">12.4</div>
                <div className="text-xs text-teal-100">Hours Focused</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs">Exercise</span>
                <span className="text-xs font-semibold">75%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1.5">
                <div className="bg-white h-1.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          {/* Health Stats */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="heart" size="sm" color="white" />
              </div>
              <span className="text-sm">Track your daily activities</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="chart" size="sm" color="white" />
              </div>
              <span className="text-sm">Monitor your progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="users" size="sm" color="white" />
              </div>
              <span className="text-sm">Join health communities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}