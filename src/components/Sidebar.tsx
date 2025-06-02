import { FiHome, FiPackage, FiTruck, FiDollarSign, FiUsers, FiSettings, FiPieChart } from 'react-icons/fi'
import { NavItem } from './NavItem'

type SidebarProps = {
  isOpen: boolean
}

export const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <aside
      className={`absolute z-30 h-[calc(100%-56px)] flex-shrink-0 border-r border-[#1F2937]/10 bg-[#FFFFFF] transition-all duration-300 ease-in-out md:block ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      <div className="flex h-full flex-col overflow-y-auto pb-4">
        <div className="mt-4 px-4">
          <h2 className={`text-xl font-bold text-[#1F2937] tracking-wide transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            Modern Rift POS
          </h2>
        </div>
        
        <nav className="mt-6 flex-1 space-y-1 px-2">
          <NavItem 
            to="/" 
            icon={<FiHome className="h-5 w-5 text-[#F97316] group-hover:text-[#3B82F6] transition-colors duration-200" />} 
            text="Dashboard" 
            className={`group flex items-center px-3 py-2 text-[#1F2937] rounded-lg hover:bg-[#F3F4F6] active:bg-[#F97316]/20 transition-all duration-200 ${isOpen ? 'justify-start' : 'justify-center'}`}
            activeClassName="bg-[#F97316] text-[#FFFFFF]"
            textClassName={isOpen ? 'block ml-3' : 'hidden'}
          />
          <NavItem 
            to="/orders" 
            icon={<FiPackage className="h-5 w-5 text-[#F97316] group-hover:text-[#3B82F6] transition-colors duration-200" />} 
            text="Orders" 
            className={`group flex items-center px-3 py-2 text-[#1F2937] rounded-lg hover:bg-[#F3F4F6] active:bg-[#F97316]/20 transition-all duration-200 ${isOpen ? 'justify-start' : 'justify-center'}`}
            activeClassName="bg-[#F97316] text-[#FFFFFF]"
            textClassName={isOpen ? 'block ml-3' : 'hidden'}
          />
          <NavItem 
            to="/deliveries" 
            icon={<FiTruck className="h-5 w-5 text-[#F97316] group-hover:text-[#3B82F6] transition-colors duration-200" />} 
            text="Deliveries" 
            className={`group flex items-center px-3 py-2 text-[#1F2937] rounded-lg hover:bg-[#F3F4F6] active:bg-[#F97316]/20 transition-all duration-200 ${isOpen ? 'justify-start' : 'justify-center'}`}
            activeClassName="bg-[#F97316] text-[#FFFFFF]"
            textClassName={isOpen ? 'block ml-3' : 'hidden'}
          />
          <NavItem 
            to="/payments" 
            icon={<FiDollarSign className="h-5 w-5 text-[#F97316] group-hover:text-[#3B82F6] transition-colors duration-200" />} 
            text="Payments" 
            className={`group flex items-center px-3 py-2 text-[#1F2937] rounded-lg hover:bg-[#F3F4F6] active:bg-[#F97316]/20 transition-all duration-200 ${isOpen ? 'justify-start' : 'justify-center'}`}
            activeClassName="bg-[#F97316] text-[#FFFFFF]"
            textClassName={isOpen ? 'block ml-3' : 'hidden'}
          />
          <NavItem 
            to="/customers" 
            icon={<FiUsers className="h-5 w-5 text-[#F97316] group-hover:text-[#3B82F6] transition-colors duration-200" />} 
            text="Customers" 
            className={`group flex items-center px-3 py-2 text-[#1F2937] rounded-lg hover:bg-[#F3F4F6] active:bg-[#F97316]/20 transition-all duration-200 ${isOpen ? 'justify-start' : 'justify-center'}`}
            activeClassName="bg-[#F97316] text-[#FFFFFF]"
            textClassName={isOpen ? 'block ml-3' : 'hidden'}
          />
          <NavItem 
            to="/reports" 
            icon={<FiPieChart className="h-5 w-5 text-[#F97316] group-hover:text-[#3B82F6] transition-colors duration-200" />} 
            text="Reports" 
            className={`group flex items-center px-3 py-2 text-[#1F2937] rounded-lg hover:bg-[#F3F4F6] active:bg-[#F97316]/20 transition-all duration-200 ${isOpen ? 'justify-start' : 'justify-center'}`}
            activeClassName="bg-[#F97316] text-[#FFFFFF]"
            textClassName={isOpen ? 'block ml-3' : 'hidden'}
          />
          <NavItem 
            to="/settings" 
            icon={<FiSettings className="h-5 w-5 text-[#F97316] group-hover:text-[#3B82F6] transition-colors duration-200" />} 
            text="Settings" 
            className={`group flex items-center px-3 py-2 text-[#1F2937] rounded-lg hover:bg-[#F3F4F6] active:bg-[#F97316]/20 transition-all duration-200 ${isOpen ? 'justify-start' : 'justify-center'}`}
            activeClassName="bg-[#F97316] text-[#FFFFFF]"
            textClassName={isOpen ? 'block ml-3' : 'hidden'}
          />
        </nav>
        
        <div className={`px-4 py-4 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
          <div className="rounded-lg bg-gradient-to-r from-[#F97316] to-[#22C55E] p-4 shadow-md">
            <p className="text-sm font-semibold text-[#F3F4F6]">Need help?</p>
            <p className="mt-1 text-xs text-[#F3F4F6]/90">Contact our support team</p>
          </div>
        </div>
      </div>
    </aside>
  )
}