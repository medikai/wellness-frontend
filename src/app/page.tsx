//src/app/page.tsx
'use client';

import { Button, Card, ProgressBar, Icon } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import DemoClassBooking from '@/components/DemoClassBooking';
import Navigation from '@/components/Navigation';
import FeatureCard from '@/components/FeatureCard';
import StepCard from '@/components/StepCard';
import TestimonialCard from '@/components/TestimonialCard';
import StatCard from '@/components/StatCard';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, GraduationCap, BarChart3, Users, CheckCircle2, Zap, Mail, Linkedin, Twitter, ChevronDown } from 'lucide-react';

export default function Home() {
  const { user, isLoading } = useAuth();
  const [hasBookedDemo, setHasBookedDemo] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Check if user has already booked a demo class
    const demoBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
    setHasBookedDemo(demoBookings.length > 0);
  }, []);

  // Scroll reveal animation
  useEffect(() => {
    if (user) return; // Only run on landing page
    
    const initObserver = () => {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );

      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => observerRef.current?.observe(el));
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(initObserver, 100);

    return () => {
      clearTimeout(timer);
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => observerRef.current?.unobserve(el));
      observerRef.current?.disconnect();
    };
  }, [user]);

  const faqs = [
    {
      question: "Do I need any technical skills to use the platform?",
      answer: "Not at all! Our platform is designed specifically for seniors with large buttons, clear instructions, and simple navigation. If you can use a tablet or smartphone, you can use our platform."
    },
    {
      question: "What equipment do I need?",
      answer: "You just need a device with internet connection - a tablet, computer, or smartphone. A camera and microphone are helpful for live classes but not required for all activities."
    },
    {
      question: "Is my information safe and secure?",
      answer: "Absolutely. We use enterprise-grade security to protect your personal information and health data. Your privacy is our top priority."
    },
    {
      question: "Can I try it before committing?",
      answer: "Yes! We offer free demo classes so you can experience the platform and see if it's right for you before making any commitment."
    },
    {
      question: "What if I need help?",
      answer: "Our support team is available to help you get started and answer any questions. We provide one-on-one assistance to ensure you're comfortable using the platform."
    }
  ];

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-[#6B7280]">Loading...</div>
        </div>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="gradient-subtle py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6">
                Wellness & Care for the Elderly,{' '}
                <span className="text-teal-primary">Made Simple</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Join live wellness classes, play fun games, and stay active—all from the comfort of your home.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/register">
                  <Button variant="hero" size="xl">
                    Join a Demo Class
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="xl">
                    Try the Platform
                  </Button>
                </Link>
              </div>
            </div>
           
            <div className="max-w-5xl mx-auto reveal-on-scroll">
              <div className="relative rounded-2xl shadow-2xl overflow-hidden">
                <img 
                  src={"/images/hero.jpg"} 
                  alt="Elderly people participating in wellness activities" 
                  className="w-full h-auto object-cover"
                  loading="eager"
                  style={{ aspectRatio: '16/9' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 reveal-on-scroll">
              <StatCard number="10K+" label="Active Members" />
              <StatCard number="500+" label="Live Classes" />
              <StatCard number="98%" label="Satisfaction Rate" />
              <StatCard number="24/7" label="Support Available" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 reveal-on-scroll">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Everything You Need to Stay Active & Healthy
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Simple, fun, and designed just for you
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="reveal-on-scroll">
                <FeatureCard
                  icon={Heart}
                  title="Join Live Wellness Classes"
                  description="Enjoy yoga, fitness, and meditation classes with real coaches. Join from home at your own pace."
                  color="primary"
                />
              </div>
              <div className="reveal-on-scroll">
                <FeatureCard
                  icon={GraduationCap}
                  title="Play Brain & Physical Games"
                  description="Fun memory games, puzzles, and gentle exercises designed to keep your mind sharp and body moving."
                  color="secondary"
                />
              </div>
              <div className="reveal-on-scroll">
                <FeatureCard
                  icon={BarChart3}
                  title="View Progress Reports"
                  description="See your achievements with simple, colorful charts that celebrate your progress and keep you motivated."
                  color="primary"
                />
              </div>
              <div className="reveal-on-scroll">
                <FeatureCard
                  icon={Users}
                  title="Encouragement Hub"
                  description="Get daily positive messages, fun activities, and connect with a supportive community of friends."
                  color="secondary"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 px-4 gradient-subtle">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 reveal-on-scroll">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Loved by Thousands
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                See what our community has to say
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="reveal-on-scroll">
                <TestimonialCard
                  name="Margaret Thompson"
                  role="Age 72, Member since 2023"
                  content="This platform has changed my life! I love joining the yoga classes from my living room. The coaches are so patient and encouraging."
                  rating={5}
                />
              </div>
              <div className="reveal-on-scroll">
                <TestimonialCard
                  name="Robert Chen"
                  role="Age 68, Member since 2024"
                  content="The brain games keep my mind sharp, and I've made wonderful friends in the community. Highly recommend!"
                  rating={5}
                />
              </div>
              <div className="reveal-on-scroll">
                <TestimonialCard
                  name="Dorothy Williams"
                  role="Age 75, Member since 2023"
                  content="Easy to use, even for someone like me who isn't great with technology. The support team helped me every step of the way."
                  rating={5}
                />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 px-4 gradient-subtle">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 reveal-on-scroll">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">How It Works</h2>
              <p className="text-xl text-muted-foreground">
                Getting started is easy—just four simple steps
              </p>
            </div>
            
            <div className="space-y-8">
              <div className="reveal-on-scroll">
                <StepCard
                  number="1"
                  title="Sign up for a free demo"
                  description="Create your account in minutes. No credit card needed, no complicated setup."
                />
              </div>
              <div className="reveal-on-scroll">
                <StepCard
                  number="2"
                  title="Join a live class or game"
                  description="Choose from yoga, fitness, meditation classes, or play fun brain games—whatever interests you!"
                />
              </div>
              <div className="reveal-on-scroll">
                <StepCard
                  number="3"
                  title="Track your simple progress report"
                  description="See your achievements with easy-to-read charts and celebrate every milestone."
                />
              </div>
              <div className="reveal-on-scroll">
                <StepCard
                  number="4"
                  title="Stay motivated with encouragement hub"
                  description="Receive daily positive messages, connect with friends, and discover new fun activities."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section id="why-us" className="py-20 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 reveal-on-scroll">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Why Choose Us
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We&apos;ve designed everything with you in mind
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 reveal-on-scroll">
                <div className="inline-flex p-4 rounded-full bg-teal-light mb-4">
                  <CheckCircle2 className="w-8 h-8 text-teal-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Simple & Accessible Design</h3>
                <p className="text-muted-foreground">Large text, clear buttons, and easy navigation. No tech skills required!</p>
              </div>
              <div className="text-center p-6 reveal-on-scroll">
                <div className="inline-flex p-4 rounded-full bg-teal-light mb-4">
                  <Users className="w-8 h-8 text-teal-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Live Classes with Real Coaches</h3>
                <p className="text-muted-foreground">Friendly, professional instructors who guide you every step of the way.</p>
              </div>
              <div className="text-center p-6 reveal-on-scroll">
                <div className="inline-flex p-4 rounded-full bg-teal-light mb-4">
                  <Heart className="w-8 h-8 text-teal-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Fun & Safe Activities</h3>
                <p className="text-muted-foreground">Games and exercises designed specifically for elderly minds and bodies.</p>
              </div>
              <div className="text-center p-6 reveal-on-scroll">
                <div className="inline-flex p-4 rounded-full bg-teal-light mb-4">
                  <Zap className="w-8 h-8 text-teal-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy to Get Started</h3>
                <p className="text-muted-foreground">Join in minutes. If you can use a tablet, you can use our platform!</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16 reveal-on-scroll">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to know about our platform
              </p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="reveal-on-scroll">
                  <Card className="overflow-hidden">
                    <button
                      onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                      className="w-full p-6 flex items-center justify-between text-left hover:bg-teal-light/10 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-neutral-dark pr-4">{faq.question}</h3>
                      <ChevronDown
                        className={`w-5 h-5 text-teal-primary flex-shrink-0 transition-transform ${
                          openFAQ === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFAQ === index && (
                      <div className="px-6 pb-6 text-muted-foreground leading-relaxed animate-fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 gradient-hero">
          <div className="max-w-4xl mx-auto text-center text-white reveal-on-scroll">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Ready to Start Your Wellness Journey?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Join our community and discover a healthier, happier you
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button variant="secondary" size="xl" className="shadow-lg hover:shadow-xl transition-shadow">
                  Book a Demo
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  variant="ghost" 
                  size="xl"
                  className="text-white hover:bg-white/20 border-2 border-white/50"
                >
                  Get Started Free
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm opacity-75">
              No credit card required • Free trial • Cancel anytime
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card border-t border-border py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-teal-primary">Waylness Platform</h3>
                <p className="text-muted-foreground">
                  Making wellness accessible, engaging, and effective for elderly communities worldwide.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <a href="mailto:hello@elderlywellness.com" className="flex items-center gap-2 text-muted-foreground hover:text-teal-primary transition-colors">
                  <Mail className="w-4 h-4" />
                  hello@elderlywellness.com
                </a>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Connect With Us</h4>
                <div className="flex gap-4">
                  <a href="#" className="p-2 rounded-full bg-teal-light hover:bg-teal-primary/80 text-teal-primary transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="p-2 rounded-full bg-teal-light hover:bg-teal-primary/80 text-teal-primary transition-colors">
                    <Twitter className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
            <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
              <p>&copy; {new Date().getFullYear()} Waylness Platform. All rights reserved.</p>
              <p className="mt-2">
                <Link href="/privacy" className="hover:text-teal-primary transition-colors">Privacy Policy</Link>
                {' • '}
                <Link href="/terms" className="hover:text-teal-primary transition-colors">Terms of Service</Link>
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Show demo class booking for new users who haven't booked a demo
  if (user && !hasBookedDemo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DemoClassBooking />
      </div>
    );
  }

  // Show dashboard for authenticated users
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-dark mb-2">Welcome to Waylness</h1>
          <p className="text-neutral-medium">Your personal health companion for a better tomorrow</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <div>
              <h2 className="text-3xl font-bold text-neutral-dark mb-2">
                {`Good morning, ${user?.name ?? 'friend'} 👋`}
              </h2>
              <p className="text-neutral-medium">
                Ready to start your health journey today?
              </p>
            </div>

            {/* Live Class Card */}
            <Card hover className="p-6 border-l-4 border-teal-primary">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm text-teal-primary font-medium">Live Class</span>
                  <h3 className="text-2xl font-bold text-neutral-dark mt-1">
                    Yoga for Joints
                  </h3>
                  <p className="text-neutral-medium mt-1">
                    Today at 10:00 AM
                  </p>
                </div>
                <Button variant="primary" size="lg">
                  Start Class →
                </Button>
              </div>
            </Card>

            {/* Progress Card */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-neutral-dark mb-4">
                Your Progress
              </h3>
              <p className="text-neutral-medium mb-4">
                You&apos;ve completed 3 classes this week 💪
              </p>
              <p className="text-neutral-dark font-medium mb-4">
                Keep going!
              </p>
              <ProgressBar 
                value={75} 
                showLabel 
                label="Weekly Goal" 
                color="teal"
              />
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="space-y-3">
              <Button variant="primary" size="lg" className="w-full">
                Join a Class
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                <Icon name="phone" size="sm" className="mr-2" />
                Get Help
              </Button>
              <Button variant="outline" size="lg" className="w-full">
                <Icon name="settings" size="sm" className="mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
    </div>
  );
}
