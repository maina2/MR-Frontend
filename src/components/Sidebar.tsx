import { FiHome, FiTruck, FiDollarSign, FiUsers, FiSettings, FiPieChart, FiChevronLeft, FiLogOut } from 'react-icons/fi'
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
        <div className={`flex items-center p-3 border-b border-gray-100 min-h-[60px] ${
          isOpen ? 'justify-end' : 'justify-center'
        }`}>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-orange-50 transition-all duration-200 text-gray-600 hover:text-orange-500 group"
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <FiChevronLeft className={`h-4 w-4 transition-transform duration-300 ${
              isOpen ? 'rotate-0' : 'rotate-180'
            }`} />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-4">
          <div className={`space-y-1 ${isOpen ? 'px-3' : 'px-2'}`}>
            <NavItem 
              to="/" 
              icon={<FiHome className="h-5 w-5" />} 
              text="Dashboard" 
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
        <div className="border-t border-gray-200 p-2">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 p-3 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 group ${
              !isOpen ? 'justify-center' : ''
            }`}
            title={!isOpen ? 'Logout' : ''}
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