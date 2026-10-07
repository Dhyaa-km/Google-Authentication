import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User, UserResponse, AuthContextType } from "../types/auth";
import api from "../services/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<UserResponse>("/users/me");
      setUser(response.data.user);
    } catch (err: any) {
      setUser(null);
      // 401 is expected when unauthenticated, don't set error state for normal 401
      if (err.response?.status !== 401) {
        if (err.code === "ERR_NETWORK") {
          setError("Backend service is unreachable. Please make sure the server is running.");
        } else {
          setError(err.response?.data?.message || "Failed to authenticate");
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        error,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
