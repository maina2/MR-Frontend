import { Link, useLocation } from 'react-router-dom'
import { IconType } from 'react-icons'

type NavItemProps = {
  to: string
  icon: React.ReactNode
  text: string
}

export const NavItem = ({ to, icon, text }: NavItemProps) => {
  const location = useLocation()
  const isActive = location.pathname === to
  
  return (
    <Link
      to={to}
      className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <span
        className={`mr-3 ${
          isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
        }`}
      >
        {icon}
      </span>
      {text}
    </Link>
  )
}