import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { User, Mail, ShieldCheck, Key, LogOut, CheckCircle2, RefreshCw } from "lucide-react";

export const Dashboard: React.FC = () => {
  const { user, logout, refreshUser, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Welcome Banner */}
      <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-slate-900 to-slate-900 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ShieldCheck className="w-48 h-48 text-indigo-400" />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-2xl border-2 border-indigo-500/30 object-cover shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white border-2 border-indigo-400/30 shadow-lg">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
          )}

          <div className="flex-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Authenticated via Google OAuth</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              Welcome back, {user.name}!
            </h1>
            <p className="mt-1 text-slate-400 text-sm">{user.email}</p>
          </div>

          <div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors shadow-sm cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Details Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-100">User Profile</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Full Name
              </label>
              <p className="mt-1 text-slate-200 font-medium">{user.name}</p>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Email Address
              </label>
              <div className="mt-1 flex items-center space-x-2 text-slate-200 font-medium">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{user.email}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                User ID
              </label>
              <p className="mt-1 font-mono text-xs text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800 break-all">
                {user.id}
              </p>
            </div>
          </div>
        </div>

        {/* Security / Auth Info Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-slate-800">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Key className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-semibold text-slate-100">Security & Session</h2>
          </div>

          <div className="space-y-4 text-sm text-slate-400">
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="font-medium text-slate-200 mb-1">HTTP-Only Cookie Session</div>
              <p className="text-xs leading-relaxed">
                Your authentication token (JWT) is stored securely in an HTTP-only cookie by the backend server. JavaScript cannot access or manipulate the raw token.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="font-medium text-slate-200 mb-1">State Verification</div>
              <p className="text-xs leading-relaxed">
                Frontend user state is retrieved directly from <code className="text-indigo-400">GET /users/me</code> endpoint with <code className="text-indigo-400">withCredentials: true</code>.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => refreshUser()}
                className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Re-verify Session (GET /users/me)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

