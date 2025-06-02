import { FiHome, FiPackage, FiPlus, FiTruck, FiPieChart } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'

export const MobileBottomNav = () => {
  const location = useLocation()
  
  const activeClass = 'text-blue-600'
  const inactiveClass = 'text-gray-500 hover:text-gray-700'
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white shadow-lg md:hidden">
      <div className="flex justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center p-3 ${location.pathname === '/' ? activeClass : inactiveClass}`}
        >
          <FiHome className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link
          to="/orders"
          className={`flex flex-col items-center p-3 ${location.pathname.startsWith('/orders') ? activeClass : inactiveClass}`}
        >
          <FiPackage className="h-6 w-6" />
          <span className="text-xs mt-1">Orders</span>
        </Link>
        
        <Link
          to="/new-order"
          className="flex flex-col items-center p-3 text-white"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 shadow-md -mt-6">
            <FiPlus className="h-6 w-6" />
          </div>
        </Link>
        
        <Link
          to="/deliveries"
          className={`flex flex-col items-center p-3 ${location.pathname.startsWith('/deliveries') ? activeClass : inactiveClass}`}
        >
          <FiTruck className="h-6 w-6" />
          <span className="text-xs mt-1">Deliveries</span>
        </Link>
        
        <Link
          to="/reports"
          className={`flex flex-col items-center p-3 ${location.pathname.startsWith('/reports') ? activeClass : inactiveClass}`}
        >
          <FiPieChart className="h-6 w-6" />
          <span className="text-xs mt-1">Reports</span>
        </Link>
      </div>
    </div>
  )
}