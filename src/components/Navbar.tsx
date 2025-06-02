import { FiSearch, FiUser, FiMenu } from 'react-icons/fi'
import { ModernRiftLogo } from './ModernRiftLogo'

type NavbarProps = {
  onMenuClick: () => void
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-50 border-b border-[#1F2937]/10 bg-[#FFFFFF] shadow-sm">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section: Menu Toggle (Mobile) + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 text-[#1F2937] hover:text-[#F97316] transition-colors duration-200"
          >
            <FiMenu className="h-6 w-6" />
          </button>
          <ModernRiftLogo className="h-8 transition-transform duration-300 hover:scale-105" />
        </div>

        {/* Desktop View - Search + Profile */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {/* Search Bar */}
          <div className="relative max-w-lg">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FiSearch className="h-5 w-5 text-[#F97316]" />
            </div>
            <input
              type="text"
              className="w-full rounded-md border-0 bg-[#F3F4F6] py-1.5 pl-10 pr-3 text-[#1F2937] ring-1 ring-inset ring-[#1F2937]/20 placeholder:text-[#1F2937]/40 focus:ring-2 focus:ring-[#3B82F6] focus:outline-none transition-all duration-200 sm:text-sm"
              placeholder="Search orders, products..."
            />
          </div>

          {/* Profile Icon */}
          <div className="relative">
            <button
              type="button"
              className="flex items-center justify-center rounded-full bg-[#F3F4F6] p-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2 focus:ring-offset-[#FFFFFF] hover:bg-[#F3F4F6]/80 transition-all duration-200"
            >
              <span className="sr-only">Open user menu</span>
              <FiUser className="h-6 w-6 text-[#22C55E] hover:text-[#3B82F6] transition-colors duration-200" />
            </button>
          </div>
        </div>

        {/* Mobile View - Search + Profile */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Search Icon (mobile) */}
          <button className="p-1 text-[#F97316] hover:text-[#3B82F6] transition-colors duration-200">
            <FiSearch className="h-5 w-5" />
          </button>
          
          {/* Profile Icon (mobile) */}
          <button className="p-1 text-[#22C55E] hover:text-[#3B82F6] transition-colors duration-200">
            <FiUser className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  )
}