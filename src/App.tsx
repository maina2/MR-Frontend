import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import { MainLayout } from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Deliveries from "./pages/Deliveries";
import Payments from "./pages/Payments";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NewOrder from "./pages/Orders/NewOrder";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Main Layout with sidebar and navbar */}
        <Route path="/" element={<MainLayout />}>
          {/* Index route */}
          <Route index element={<Dashboard />} />

          {/* Main routes */}
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders/new" element={<NewOrder />} />
          <Route path="deliveries" element={<Deliveries />} />
          <Route path="payments" element={<Payments />} />
          <Route path="customers" element={<Customers />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<UserProfile />} />
        </Route>
        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
