import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Sidebar } from '../components/Sidebar'
import { Footer } from '../components/Footer'
import { MobileBottomNav } from '../components/MobileBottomNav'

export const MainLayout = () => {
  // Changed from true to false to make collapsed the default
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      {/* Main Content Container */}
      <div className={`transition-all duration-300 ${
        sidebarOpen ? 'md:ml-64' : 'md:ml-16'
      }`}>
        {/* Main Content */}
        <main className="min-h-[calc(100vh-56px-64px)] pt-6 pb-6 px-6 md:pb-16">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
        
        {/* Footer - Now properly positioned */}
        <Footer />
      </div>
      
      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  )
}