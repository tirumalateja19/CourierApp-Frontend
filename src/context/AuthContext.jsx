import { useState, useEffect } from "react";
import api from "../api/axios";
import {AuthContext} from "./auth-context"

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await api.get("/api/auth/me");
        setUser(response.data);
      } catch (error) {
        console.error(error);
        // A 401 here just means "not logged in" — not a real error.
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const loginAdmin = async (credentials) => {
    const response = await api.post("/api/admin/login", credentials);
    setUser(response.data);
    return response.data;
  };

  const loginPartner = async (credentials) => {
    const response = await api.post("/api/partner/login", credentials);
    setUser(response.data);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    loginAdmin,
    loginPartner,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

