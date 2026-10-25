'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Shield,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Lock,
  Mail,
  User,
  Sparkles,
  Building2,
  Users,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/lib/store/useAuthStore';
import { UserRole } from '@/lib/types';
import { DEMO_USERS } from '@/lib/seed/data';

export default function AuthPage() {
  const router = useRouter();
  const { loginAs, loginWithCustom } = useAuthStore();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [selectedRole, setSelectedRole] = useState<UserRole>('district_officer');
  const [email, setEmail] = useState('collector.krishna@ap.gov.in');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('Dr. Ramesh Chandra IAS');
  const [organization, setOrganization] = useState('DDMA Krishna');

  const [errors, setErrors] = useState<{ email?: string; password?: string; fullName?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const rolesConfig: { id: UserRole; title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'district_officer',
      title: 'District Officer',
      subtitle: 'District Collectorate / DDMA Command',
      icon: Users,
    },
    {
      id: 'ngo_coordinator',
      title: 'NGO Coordinator',
      subtitle: 'Red Cross & Relief Logistics Coalition',
      icon: Building2,
    },
    {
      id: 'volunteer',
      title: 'Field Volunteer',
      subtitle: 'Mobile Task Force & Incident Reporting',
      icon: Compass,
    },
  ];

  const handleQuickDemo = (role: UserRole) => {
    loginAs(role);
    if (role === 'volunteer') {
      router.push('/app/dispatch');
    } else {
      router.push('/app/dashboard');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!email || !email.includes('@')) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (mode === 'signup' && !fullName.trim()) {
      newErrors.fullName = 'Please enter your full name';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    setTimeout(() => {
      loginWithCustom({
        id: `usr-${Date.now()}`,
        name: fullName || 'Demo Responder',
        email,
        role: selectedRole,
        title: selectedRole === 'district_officer' ? 'District Magistrate' : selectedRole === 'ngo_coordinator' ? 'Logistics Officer' : 'Community Volunteer',
        organization: organization || 'Disaster Response Network',
      });
      setIsLoading(false);

      if (selectedRole === 'volunteer') {
        router.push('/app/dispatch');
      } else {
        router.push('/app/dashboard');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-transparent">
      {/* Top Branding Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-400 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform">
            <Shield className="w-6 h-6 fill-white/20" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-800">
            Relief<span className="text-primary-600">IQ</span>
          </span>
        </Link>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Authorized Disaster Management & Volunteer Access Portal
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <Card className="bg-white/90 backdrop-blur-xl border-slate-200/90 shadow-2xl rounded-[32px] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: 1-Click Instant Demo Login (Reviewer Favorite) */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 border-b lg:border-b-0 lg:border-r border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pastel-butter text-pastel-butter-dark border border-pastel-butter-border text-[11px] font-bold uppercase tracking-wider mb-4">
                  <Sparkles className="w-3.5 h-3.5" />
                  Instant Reviewer Access
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Continue as Demo User
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Skip registration and immediately explore the platform calibrated for Krishna District, AP.
                </p>

                <div className="mt-6 space-y-3">
                  {rolesConfig.map((r) => {
                    const Icon = r.icon;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleQuickDemo(r.id)}
                        className="w-full p-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs hover:shadow-md transition-all text-left flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{r.title}</p>
                            <p className="text-[11px] text-slate-500">{r.subtitle}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200/60 mt-6 text-[11px] text-slate-500">
                <p className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  All 16 AP zones and 3 warehouses pre-loaded.
                </p>
              </div>
            </div>

            {/* Right Column: Standard Login / Registration Form */}
            <div className="lg:col-span-7 p-6 sm:p-8">
              {/* Form Toggle: Sign In vs Sign Up */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900">
                    {mode === 'signin' ? 'Sign In to Portal' : 'Register New Responder'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {mode === 'signin'
                      ? 'Enter your credentials or choose a role below'
                      : 'Join the disaster response command network'}
                  </p>
                </div>

                <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setMode('signin')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      mode === 'signin' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('signup')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      mode === 'signup' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
              </div>

              {/* Role Selection Chips */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Designational Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {rolesConfig.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setSelectedRole(r.id);
                        if (r.id === 'district_officer') {
                          setEmail(DEMO_USERS.district_officer.email);
                          setFullName(DEMO_USERS.district_officer.name);
                        } else if (r.id === 'ngo_coordinator') {
                          setEmail(DEMO_USERS.ngo_coordinator.email);
                          setFullName(DEMO_USERS.ngo_coordinator.name);
                        } else {
                          setEmail(DEMO_USERS.volunteer.email);
                          setFullName(DEMO_USERS.volunteer.name);
                        }
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        selectedRole === r.id
                          ? 'bg-primary-50 border-primary-500 text-primary-800 font-bold ring-2 ring-primary-500/20'
                          : 'bg-white/80 border-slate-200 text-slate-600 hover:bg-slate-50 font-medium'
                      }`}
                    >
                      <p className="text-xs truncate">{r.title}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Elements */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <>
                    <Input
                      label="Full Name"
                      type="text"
                      placeholder="e.g. Dr. Ramesh Chandra IAS"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      error={errors.fullName}
                    />
                    <Input
                      label="Agency / Organization"
                      type="text"
                      placeholder="e.g. DDMA Krishna or AP Volunteers"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                    />
                  </>
                )}

                <Input
                  label="Official Email Address"
                  type="email"
                  placeholder="name@ap.gov.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                />

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isLoading}
                    className="w-full shadow-soft"
                  >
                    <span>{mode === 'signin' ? 'Sign In & Launch Console' : 'Create Account & Enter'}</span>
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
