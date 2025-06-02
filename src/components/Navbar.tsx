import { FiSearch, FiUser } from 'react-icons/fi'
import { ModernRiftLogo } from './ModernRiftLogo'

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo - Always visible */}
        <div className="flex items-center">
          <ModernRiftLogo className="h-8" />
        </div>

        {/* Desktop View - Search + Profile */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {/* Search Bar */}
          <div className="relative max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border-0 bg-gray-50 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
              placeholder="Search orders, products..."
            />
          </div>

          {/* Profile Icon */}
          <div className="relative">
            <button
              type="button"
              className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span className="sr-only">Open user menu</span>
              <FiUser className="h-8 w-8 rounded-full text-gray-500" />
            </button>
          </div>
        </div>

        {/* Mobile View - Search + Profile */}
        <div className="flex items-center gap-4 md:hidden">
          {/* Search Icon (mobile) */}
          <button className="p-2 text-gray-500 hover:text-gray-600">
            <FiSearch className="h-5 w-5" />
          </button>
          
          {/* Profile Icon (mobile) */}
          <button className="p-2 text-gray-500 hover:text-gray-600">
            <FiUser className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  )
}