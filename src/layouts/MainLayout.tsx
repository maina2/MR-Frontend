import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'
import { Footer } from '../components/Footer'
import { MobileBottomNav } from '../components/MobileBottomNav'

export const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Top Navbar (always visible) */}
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (desktop only) */}
        <Sidebar isOpen={sidebarOpen} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 pb-20 md:pb-4">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Footer (desktop only) */}
      <Footer />
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}