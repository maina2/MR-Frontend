import { FiHome, FiPackage, FiTruck, FiDollarSign, FiUsers, FiSettings, FiPieChart } from 'react-icons/fi'
import { NavItem } from './NavItem'

type SidebarProps = {
  isOpen: boolean
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <aside
      className={`fixed inset-y-0 z-30 hidden h-full w-64 flex-shrink-0 border-r border-gray-200 bg-white transition-all duration-300 ease-in-out md:block ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex h-full flex-col overflow-y-auto pb-4">
        <div className="mt-5 px-4">
          <h2 className="text-lg font-medium text-gray-900">Modern Rift POS</h2>
        </div>
        
        <nav className="mt-6 flex-1 space-y-1 px-2">
          <NavItem to="/" icon={<FiHome />} text="Dashboard" />
          <NavItem to="/orders" icon={<FiPackage />} text="Orders" />
          <NavItem to="/deliveries" icon={<FiTruck />} text="Deliveries" />
          <NavItem to="/payments" icon={<FiDollarSign />} text="Payments" />
          <NavItem to="/customers" icon={<FiUsers />} text="Customers" />
          <NavItem to="/reports" icon={<FiPieChart />} text="Reports" />
          <NavItem to="/settings" icon={<FiSettings />} text="Settings" />
        </nav>
        
        <div className="px-4 py-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-800">Need help?</p>
            <p className="mt-1 text-xs text-blue-700">Contact our support team</p>
          </div>
        </div>
      </div>
    </aside>
  )
}