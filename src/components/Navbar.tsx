import { FiMenu, FiSearch, FiBell, FiUser, FiPlus } from 'react-icons/fi'
import { ModernRiftLogo } from './ModernRiftLogo'

type NavbarProps = {
  onMenuClick: () => void
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button and logo */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600 md:hidden"
            onClick={onMenuClick}
          >
            <FiMenu className="h-6 w-6" />
          </button>
          <ModernRiftLogo className="h-8" />
        </div>

        {/* Desktop search and actions */}
        <div className="hidden flex-1 md:flex md:items-center md:justify-between">
          <div className="ml-10 max-w-md flex-1">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full rounded-md border-0 bg-gray-50 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 sm:text-sm sm:leading-6"
                placeholder="Search orders, products..."
              />
            </div>
          </div>

          <div className="ml-4 flex items-center gap-4">
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
              <FiPlus className="h-4 w-4" />
              <span>New Order</span>
            </button>

            <button
              type="button"
              className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <FiBell className="h-6 w-6" />
              <span className="sr-only">View notifications</span>
            </button>

            <div className="relative ml-3">
              <button
                type="button"
                className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="sr-only">Open user menu</span>
                <FiUser className="h-8 w-8 rounded-full text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}