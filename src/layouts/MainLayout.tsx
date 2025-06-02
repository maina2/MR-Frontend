import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'
import { Footer } from '../components/Footer'
import { MobileBottomNav } from '../components/MobileBottomNav'

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen flex-col bg-[#F3F4F6]">
      {/* Top Navbar (always visible) */}
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (desktop only) */}
        <Sidebar isOpen={sidebarOpen} />
        
        <div className="flex-1 flex flex-col">
          {/* Main Content Area */}
          <main className={`flex-1 overflow-y-auto p-6 pb-24 md:pb-6 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-16'}`}>
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
          
          {/* Footer (desktop only) */}
          <Footer />
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}