import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { AuthService } from '../services/authService';
import { auth, isFirebaseConfigured, db } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<UserProfile>;
  register: (name: string, email: string, mobile: string, pass: string, role?: UserRole) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => AuthService.getStoredUser());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const firestore = db;
    if (isFirebaseConfigured && auth && firestore) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          try {
            const userSnap = await getDoc(doc(firestore, 'users', fbUser.uid));
            if (userSnap.exists()) {
              const profile = { id: fbUser.uid, ...userSnap.data() } as UserProfile;
              setUser(profile);
              AuthService.setStoredUser(profile);
            }
          } catch (e) {
            console.warn('Error reading user document on auth state change', e);
          }
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // In local store mode, initial user from localStorage is already loaded
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<UserProfile> => {
    const loggedUser = await AuthService.login(email, pass);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (
    name: string,
    email: string,
    mobile: string,
    pass: string,
    role: UserRole = 'customer'
  ): Promise<UserProfile> => {
    const newUser = await AuthService.register(name, email, mobile, pass, role);
    setUser(newUser);
    return newUser;
  };

  const logout = async (): Promise<void> => {
    await AuthService.logout();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    if (!user) throw new Error('No active user to update');
    const updated = await AuthService.updateProfile(user.id, updates);
    setUser(updated);
    return updated;
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
