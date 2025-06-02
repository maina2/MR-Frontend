import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { MainLayout } from './layouts/MainLayout'
import { Dashboard } from './pages/Dashboard'
import { Orders } from './pages/Orders'
import { Deliveries } from './pages/Deliveries'
import { Payments } from './pages/Payments'
import { Customers } from './pages/Customers'
import { Reports } from './pages/Reports'
import { Settings } from './pages/Settings'
import { NewOrder } from './pages/NewOrder'
import { NotFound } from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Layout with sidebar and navbar */}
        <Route path="/" element={<MainLayout />}>
          {/* Index route */}
          <Route index element={<Dashboard />} />
          
          {/* Main routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/new" element={<NewOrder />} />
          <Route path="deliveries" element={<Deliveries />} />
          <Route path="payments" element={<Payments />} />
          <Route path="customers" element={<Customers />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />

          {/* 404 catch-all */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App