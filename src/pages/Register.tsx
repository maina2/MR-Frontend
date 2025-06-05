import React, { useState } from 'react';
import { useAuth } from '../store/authContext';
import {  Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(username, email, password);
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-500 rounded-full filter blur-xl animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-400 rounded-full filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-300 rounded-full filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Registration Form */}
        <div className="flex justify-center lg:justify-start">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">MR</span>
                </div>
                <h1 className="text-2xl font-bold text-green-600">
                  Modern Rift POS
                </h1>
              </div>
            </div>

            {/* Register Card */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Hello User!</h2>
                <p className="text-gray-600">Create your account today✨</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
                  <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 text-xs">⚠</span>
                  </div>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  {/* Username Field */}
                  <div>
                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:bg-white transition-all duration-200"
                      placeholder="Choose a username"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:bg-white transition-all duration-200"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:bg-white transition-all duration-200"
                        placeholder="Create a secure password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-yellow-500 transition-colors p-1"
                      >
                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-500 hover:bg-green-600 hover:shadow-lg transform hover:-translate-y-0.5'
                  }`}
                >
                  {loading && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                  {loading ? 'Creating account...' : 'Create account'}
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    to="/login" 
                    className="font-semibold text-yellow-600 hover:text-yellow-700 transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Welcome Content */}
        <div className="hidden lg:flex flex-col justify-center space-y-8 px-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">MR</span>
              </div>
              <h1 className="text-4xl font-bold text-green-600">
                Modern Rift POS
              </h1>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-800">
                Start your business journey today
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Join thousands of successful businesses that trust Modern Rift POS to manage their operations, inventory, and sales.
              </p>
            </div>

            <div className="space-y-4 pt-6">
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">30-day free trial</h3>
                    <p className="text-sm text-gray-600">No credit card required</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">🚀</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Quick setup</h3>
                    <p className="text-sm text-gray-600">Get started in under 5 minutes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-semibold">💬</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">24/7 support</h3>
                    <p className="text-sm text-gray-600">We're here when you need us</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>
        {`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}
      </style>
    </div>
  );
};

export default Register;