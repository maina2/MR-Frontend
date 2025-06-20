import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation, useLoginMutation, useLogoutMutation, useGetUserQuery } from '../api/apiSlice';
import type { AuthContextType, User } from '../types/users';
import toast from 'react-hot-toast';

// Create the context with a default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const [logout] = useLogoutMutation();
  const { data: userData, isLoading: isUserLoading, error: userError, refetch } = useGetUserQuery(undefined, {
    skip: !localStorage.getItem('accessToken'), 
  });

  // Initialize auth state
  useEffect(() => {
    if (userError) {
      if ('status' in userError && userError.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      }
      setError('Authentication error');
    } else if (userData) {
      setUser(userData as User);
    }
    setLoading(isUserLoading);
  }, [userData, isUserLoading, userError]);

  const handleLogin = async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await login({ username, password }).unwrap();
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);

      // Refetch user data after login using the refetch function
      const userResponse = await refetch();
      if (userResponse.data) {
        setUser(userResponse.data as User);
      }
      navigate('/dashboard');
    } catch (_) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await register({ username, email, password }).unwrap();
      localStorage.setItem('accessToken', data.access);
      localStorage.setItem('refreshToken', data.refresh);

      setUser({
        id: data.data.id,
        username: data.data.username,
        email: data.data.email,
      });
      navigate('/dashboard');
    } catch (_) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await logout(refreshToken).unwrap();
      }

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (err) {
      setError('An error occurred during logout. Please try again.');
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };
  const isAuthenticated = !!user;

  return React.createElement(
    AuthContext.Provider,
    {
      value: {
        user: user,
        loading: loading,
        error: error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        isAuthenticated: isAuthenticated,
      },
    },
    children
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context || context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context as AuthContextType;
};