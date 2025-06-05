import { FiSearch, FiUser, FiX, FiLogOut, FiMenu } from 'react-icons/fi'
import { useState } from 'react'
import { ModernRiftLogo } from './ModernRiftLogo'

interface NavbarProps {
  onMenuClick: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false)

  const handleLogout = () => {
    // Add your logout logic here
    // For example: clear tokens, redirect to login, etc.
    console.log('Logout clicked')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="h-14 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            {/* Menu Button */}
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg text-gray-600 hover:text-orange-500 hover:bg-gray-50 transition-all duration-200"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            {/* Logo */}
            <div className="flex items-center">
              <ModernRiftLogo className="h-8 transition-transform duration-300 hover:scale-105" />
              <span className="ml-2 text-lg font-bold text-gray-800 hidden sm:block">
                Modern Rift
              </span>
            </div>
          </div>

          {/* Center Section - Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="h-5 w-5 text-orange-500" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm"
                placeholder="Search orders, products, customers..."
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-orange-500 hover:bg-gray-50 transition-all duration-200"
            >
              {showMobileSearch ? <FiX className="h-5 w-5" /> : <FiSearch className="h-5 w-5" />}
            </button>

            {/* Profile (Visible on all screens) */}
            <button className="flex items-center gap-2 p-2 rounded-lg text-gray-600 hover:text-orange-500 hover:bg-gray-50 transition-all duration-200">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-green-500 rounded-full flex items-center justify-center">
                <FiUser className="h-4 w-4 text-white" />
              </div>
              <span className="hidden sm:block text-sm font-medium">Profile</span>
            </button>

            {/* Logout (Mobile only) */}
            <button
              onClick={handleLogout}
              className="md:hidden p-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
            >
              <FiLogOut className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden pb-4 border-t border-gray-100 mt-4 pt-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="h-5 w-5 text-orange-500" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white transition-all duration-200"
                placeholder="Search orders, products, customers..."
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}