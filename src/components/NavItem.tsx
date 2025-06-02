import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

type NavItemProps = {
  to: string
  icon: ReactNode
  text: string
  isCollapsed: boolean
}

export const NavItem = ({ to, icon, text, isCollapsed }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group relative flex items-center rounded-xl transition-all duration-200 ${
          isCollapsed 
            ? 'justify-center p-3 mx-auto w-12 h-12' 
            : 'justify-start p-3'
        } ${
          isActive
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
            : 'text-gray-600 hover:bg-gray-50 hover:text-orange-500'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`flex-shrink-0 transition-all duration-200 ${
            isActive ? 'text-white' : 'text-orange-500 group-hover:text-orange-600'
          }`}>
            {icon}
          </div>
          
          {!isCollapsed && (
            <span className="ml-3 text-sm font-medium whitespace-nowrap transition-all duration-200">
              {text}
            </span>
          )}
          
          {/* Tooltip for collapsed state */}
          {isCollapsed && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
              {text}
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-4 border-r-gray-900 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
            </div>
          )}
          
          {/* Active indicator */}
          {isActive && !isCollapsed && (
            <div className="absolute right-3 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          )}
        </>
      )}
    </NavLink>
  )
}