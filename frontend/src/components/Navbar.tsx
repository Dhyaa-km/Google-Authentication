import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut } from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-600/10 border border-indigo-500/20 text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-semibold text-slate-100 tracking-tight text-lg">
            OAuth<span className="text-indigo-400">Auth</span>
          </span>
        </div>

        {isAuthenticated && user && (
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-3 text-right">
              <div>
                <p className="text-sm font-medium text-slate-200">{user.name}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full border border-slate-700 object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium text-sm">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

