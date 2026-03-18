import { useState, useEffect } from "react";
import { useLocation } from "wouter";

// Simple mock auth store
let isAuthenticated = false;

export function useAuth() {
  const [, setLocation] = useLocation();
  const [isLogged, setIsLogged] = useState(isAuthenticated);

  useEffect(() => {
    setIsLogged(isAuthenticated);
  }, []);

  const login = async () => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    isAuthenticated = true;
    setIsLogged(true);
    setLocation("/dashboard");
  };

  const logout = () => {
    isAuthenticated = false;
    setIsLogged(false);
    setLocation("/login");
  };

  return { isLogged, login, logout, user: isLogged ? { name: "أحمد محمد" } : null };
}
