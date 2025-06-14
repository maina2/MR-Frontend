
import { Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { MainLayout } from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Deliveries from "./pages/Deliveries";
import Payments from "./pages/Payments";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Unprotected routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes under MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            {/* Index route */}
            <Route index element={<Dashboard />} />

            {/* Main routes */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="deliveries" element={<Deliveries />} />
            <Route path="payments" element={<Payments />} />
            <Route path="customers" element={<Customers />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>
        </Route>

        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
