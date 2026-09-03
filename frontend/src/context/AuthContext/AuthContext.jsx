"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../../api/api.js";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await api.auth.me();
      if (res && res.login) {
        let isAdmin = false;
        try {
          const stats = await api.admin.getStats();
          if (stats && stats.authenticated && stats.isAdmin) {
            isAdmin = true;
          }
        } catch (_) {
          // not an admin or error checking stats
        }
        const userData = {
          userName: res.name || res.login,
          login: res.login,
          email: res.email || "",
          isAdmin,
          isAuth: true,
        };
        setUser(userData);
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData));
        }
        return userData;
      } else {
        setUser(null);
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
        }
        return null;
      }
    } catch (err) {
      console.warn("Session check failed:", err.message);
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fast hydration from localStorage
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("user");
        if (cached) {
          setUser(JSON.parse(cached));
        }
      } catch (e) {
        console.error("Failed to parse cached user:", e);
      }
    }
    checkAuth();
  }, [checkAuth]);

  const login = async ({ login: loginValue, password }) => {
    try {
      const res = await api.auth.login({ login: loginValue, password });
      if (res && res.success) {
        const userData = {
          userName: res.userName || loginValue,
          login: loginValue,
          email: res.email || "",
          isAdmin: !!res.isAdmin,
          isAuth: true,
        };
        setUser(userData);
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(userData));
        }
        return { success: true, user: userData };
      }
      return { success: false, message: res?.message || "Invalid credentials" };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Login failed";
      return { success: false, message: msg };
    }
  };

  const register = async (registerData) => {
    try {
      const res = await api.auth.register(registerData);
      return res;
    } catch (error) {
      const msg = error.response?.data?.message || error.message || "Registration failed";
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch (e) {
      console.error("Logout request error:", e);
    } finally {
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
