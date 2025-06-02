import { FiHome, FiPackage, FiTruck, FiDollarSign, FiUsers, FiSettings, FiPieChart, FiChevronLeft, FiLogOut } from 'react-icons/fi'
import { NavItem } from './NavItem'

type SidebarProps = {
  isOpen: boolean
  onToggle: () => void
}

export const Sidebar = ({ isOpen, onToggle }: SidebarProps) => {
  const handleLogout = () => {
    // Add your logout logic here
    // For example: clear tokens, redirect to login, etc.
    console.log('Logout clicked')
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-14 bottom-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out shadow-lg ${
          isOpen ? 'w-64' : 'w-16'
        } hidden md:flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-end p-4 border-b border-gray-100">
          <button
            onClick={onToggle}
            className={`p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200 ${
              isOpen ? 'text-gray-600 hover:text-orange-500' : 'text-orange-500 hover:text-orange-600'
            }`}
          >
            <FiChevronLeft className={`h-4 w-4 transition-transform duration-300 ${
              isOpen ? 'rotate-0' : 'rotate-180'
            }`} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 space-y-1">
            <NavItem 
              to="/" 
              icon={<FiHome className="h-5 w-5" />} 
              text="Dashboard" 
              isCollapsed={!isOpen}
            />
            <NavItem 
              to="/orders" 
              icon={<FiPackage className="h-5 w-5" />} 
              text="Orders" 
              isCollapsed={!isOpen}
            />
            <NavItem 
              to="/deliveries" 
              icon={<FiTruck className="h-5 w-5" />} 
              text="Deliveries" 
              isCollapsed={!isOpen}
            />
            <NavItem 
              to="/payments" 
              icon={<FiDollarSign className="h-5 w-5" />} 
              text="Payments" 
              isCollapsed={!isOpen}
            />
            <NavItem 
              to="/customers" 
              icon={<FiUsers className="h-5 w-5" />} 
              text="Customers" 
              isCollapsed={!isOpen}
            />
            <NavItem 
              to="/reports" 
              icon={<FiPieChart className="h-5 w-5" />} 
              text="Reports" 
              isCollapsed={!isOpen}
            />
            <NavItem 
              to="/settings" 
              icon={<FiSettings className="h-5 w-5" />} 
              text="Settings" 
              isCollapsed={!isOpen}
            />
          </div>
        </nav>
        
        {/* Logout Section */}
        <div className="border-t border-gray-200 p-3">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 ${
              !isOpen ? 'justify-center' : ''
            }`}
          >
            <FiLogOut className="h-5 w-5 flex-shrink-0" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar might be shown */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={onToggle}
        />
      )}
    </>
  )
}