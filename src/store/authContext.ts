import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegisterMutation, useLoginMutation, useLogoutMutation, useGetUserQuery } from '../api/apiSlice';

// Define the user type based on your UserSerializer
type User = {
  id: number;
  username: string;
  email: string;
};

// Define the auth context shape
type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
};

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
  const { data: userData, isLoading: isUserLoading, error: userError } = useGetUserQuery(undefined, {
    skip: !localStorage.getItem('accessToken'), // Skip query if no token
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

      // Refetch user data after login
      const userResponse = await useGetUserQuery(undefined, { forceRefetch: true }).unwrap();
      setUser(userResponse);
      navigate('/dashboard');
    } catch (err) {
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
    } catch (err) {
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
      navigate('/login');
    } catch (err) {
      setError('An error occurred during logout.');
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
      }
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