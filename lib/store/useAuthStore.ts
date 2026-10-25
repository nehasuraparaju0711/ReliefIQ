import { create } from 'zustand';
import { UserProfile, UserRole } from '@/lib/types';
import { DEMO_USERS } from '@/lib/seed/data';

interface AuthState {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  loginAs: (role: UserRole) => void;
  loginWithCustom: (user: UserProfile) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Default to District Officer so reviewers can immediately see full functionality, but customizable
  user: DEMO_USERS.district_officer,
  role: 'district_officer',
  isAuthenticated: true,

  loginAs: (role: UserRole) => {
    const demoUser = DEMO_USERS[role];
    if (demoUser) {
      set({ user: demoUser, role, isAuthenticated: true });
      if (typeof window !== 'undefined') {
        localStorage.setItem('reliefiq_user_role', role);
      }
    }
  },

  loginWithCustom: (user: UserProfile) => {
    set({ user, role: user.role, isAuthenticated: true });
    if (typeof window !== 'undefined') {
      localStorage.setItem('reliefiq_user_role', user.role);
    }
  },

  logout: () => {
    set({ user: null, role: null, isAuthenticated: false });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('reliefiq_user_role');
    }
  },

  switchRole: (role: UserRole) => {
    const demoUser = DEMO_USERS[role];
    if (demoUser) {
      set({ user: demoUser, role, isAuthenticated: true });
      if (typeof window !== 'undefined') {
        localStorage.setItem('reliefiq_user_role', role);
      }
    }
  },
}));
