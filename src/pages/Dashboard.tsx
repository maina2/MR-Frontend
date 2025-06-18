import { useGetDashboardStatsQuery } from "../api/apiSlice";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { data: stats, isLoading, isError } = useGetDashboardStatsQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-2">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-200 border-t-orange-500"></div>
          <p className="text-slate-600 font-medium">Loading dashboard stats...</p>
        </div>
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="text-5xl mb-2">⚠️</div>
          <p className="text-rose-600 font-semibold">Failed to load dashboard stats. Please try again.</p>
          <p className="text-slate-500 mt-1">Check your connection or refresh the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-2 sm:p-4 pb-16">
      <div className="max-w-7xl mx-auto min-h-[calc(100vh-64px)]">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-2 sm:space-y-0">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Dashboard Overview
          </h1>
          <button
            onClick={() => {
              toast.success("Refreshed dashboard stats!");
            }}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 rounded-xl border border-white/60 shadow-sm p-6 hover:shadow-md transition-all duration-200">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Deliveries</h2>
            <p className="text-3xl font-bold text-slate-800 mt-2">{stats.total_deliveries}</p>
          </div>
          <div className="bg-white/80 rounded-xl border border-white/60 shadow-sm p-6 hover:shadow-md transition-all duration-200">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Customers</h2>
            <p className="text-3xl font-bold text-slate-800 mt-2">{stats.total_customers}</p>
          </div>
          <div className="bg-white/80 rounded-xl border border-white/60 shadow-sm p-6 hover:shadow-md transition-all duration-200">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Payments</h2>
            <p className="text-3xl font-bold text-slate-800 mt-2">
              {typeof stats.total_payments === "number" && stats.total_payments !== null
                ? `${stats.total_payments.toFixed(2)}`
                : "00"}
            </p>
          </div>
          <div className="bg-white/80 rounded-xl border border-white/60 shadow-sm p-6 hover:shadow-md transition-all duration-200">
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Reports</h2>
            <p className="text-3xl font-bold text-slate-800 mt-2">{stats.total_reports}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
