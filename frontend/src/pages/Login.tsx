import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Shield, AlertCircle, Loader2 } from "lucide-react";

export const Login: React.FC = () => {
  const { isAuthenticated, loading: authLoading, error: authError } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleLogin = () => {
    try {
      setIsRedirecting(true);
      setErrorMsg(null);
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";
      // Browser navigation to backend Google OAuth endpoint
      window.location.href = `${apiUrl}/auth/google`;
    } catch (err: any) {
      setIsRedirecting(false);
      setErrorMsg("Failed to initiate Google sign-in. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8 relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mb-4">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Sign in securely using your Google account to access your dashboard.
          </p>
        </div>

        {(authError || errorMsg) && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start space-x-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>{errorMsg || authError}</span>
          </div>
        )}

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={isRedirecting}
            className="w-full py-3 px-4 flex items-center justify-center space-x-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-100 font-medium border border-slate-700 hover:border-slate-600 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            {isRedirecting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                <span>Redirecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="pt-4 text-center border-t border-slate-800">
            <p className="text-xs text-slate-500">
              Authentication is handled securely via Google OAuth 2.0. No password storage required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

