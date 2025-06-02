import { FiHome, FiPackage, FiTruck, FiDollarSign, FiUsers } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', icon: FiHome, label: 'Home' },
  { to: '/orders', icon: FiPackage, label: 'Orders' },
  { to: '/deliveries', icon: FiTruck, label: 'Delivery' },
  { to: '/payments', icon: FiDollarSign, label: 'Payments' },
  { to: '/customers', icon: FiUsers, label: 'Customers' },
]

export const MobileBottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center space-y-1 transition-all duration-200 ${
                isActive
                  ? 'text-orange-500 bg-orange-50'
                  : 'text-gray-600 hover:text-orange-500 hover:bg-gray-50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-lg transition-all duration-200 ${
                  isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' : ''
                }`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">{label}</span>
                {isActive && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-orange-500 rounded-b-full"></div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}