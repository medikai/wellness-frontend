'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Icon } from '@/components/ui';
import Link from 'next/link';

export default function RegisterPage() {
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user data in localStorage (in real app, this would be handled by your backend)
      localStorage.setItem('user', JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        isAuthenticated: true
      }));
      
      router.push('/');
    } catch {
      setErrors({ general: 'Registration failed. Please try again.' });
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
              <h2 className="text-2xl font-bold text-neutral-dark mb-1">Get Started Now</h2>
              <p className="text-sm text-neutral-medium">Enter your credentials to access your account</p>
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
                  className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-primary focus:border-teal-primary transition-all duration-200 ${
                    errors.name ? 'border-red-300' : 'border-neutral-200'
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
                  className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-primary focus:border-teal-primary transition-all duration-200 ${
                    errors.email ? 'border-red-300' : 'border-neutral-200'
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
                  className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-primary focus:border-teal-primary transition-all duration-200 ${
                    errors.phone ? 'border-red-300' : 'border-neutral-200'
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
                    className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-primary focus:border-teal-primary transition-all duration-200 pr-10 ${
                      errors.password ? 'border-red-300' : 'border-neutral-200'
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
                    className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-teal-primary focus:border-teal-primary transition-all duration-200 pr-10 ${
                      errors.confirmPassword ? 'border-red-300' : 'border-neutral-200'
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
                variant="primary"
                size="lg"
                className="w-full py-3 text-base font-semibold rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
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
            <h2 className="text-3xl font-bold mb-3">Join Our Health Community</h2>
            <p className="text-lg text-teal-100">Connect with others on their wellness journey</p>
          </div>

          {/* Health Classes Preview */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3">Live Classes Today</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white/20 rounded-lg p-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                    <Icon name="heart" size="sm" color="white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Yoga for Joints</div>
                    <div className="text-xs text-teal-100">10:00 AM - 11:00 AM</div>
                  </div>
                </div>
                <div className="text-xs font-semibold">Live</div>
              </div>
              <div className="flex items-center justify-between bg-white/20 rounded-lg p-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                    <Icon name="heart" size="sm" color="white" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Meditation Session</div>
                    <div className="text-xs text-teal-100">2:00 PM - 2:30 PM</div>
                  </div>
                </div>
                <div className="text-xs font-semibold">Upcoming</div>
              </div>
            </div>
          </div>

          {/* Health Features */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="heart" size="sm" color="white" />
              </div>
              <span className="text-sm">Join live health classes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="chart" size="sm" color="white" />
              </div>
              <span className="text-sm">Track your wellness progress</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="users" size="sm" color="white" />
              </div>
              <span className="text-sm">Connect with health experts</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <Icon name="gamepad" size="sm" color="white" />
              </div>
              <span className="text-sm">Play health-focused games</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}