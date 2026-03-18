import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  login as alfrescoLogin,
  logout as alfrescoLogout,
  isLoggedIn,
  clearTicket,
} from "@/services/alfrescoApi";

export function useAuth() {
  const [, setLocation] = useLocation();
  const [isLogged, setIsLogged] = useState(isLoggedIn());

  useEffect(() => {
    setIsLogged(isLoggedIn());
  }, []);

  const login = async (username: string, password: string) => {
    try {
      await alfrescoLogin(username, password);
      setIsLogged(true);
      setLocation("/dashboard");
      return { success: true };
    } catch (err: any) {
      if (err.message === "ALFRESCO_UNREACHABLE") {
        // Mock fallback: allow admin/admin when Alfresco is down
        if (username === "admin" && password === "admin") {
          localStorage.setItem("alf_ticket", "MOCK_TICKET");
          setIsLogged(true);
          setLocation("/dashboard");
          return { success: true, mock: true };
        }
        return {
          success: false,
          error: "تعذر الاتصال بخادم Alfresco. تأكد من أن الخادم يعمل.",
        };
      }
      return {
        success: false,
        error: "اسم المستخدم أو كلمة المرور غير صحيحة",
      };
    }
  };

  const logout = async () => {
    try {
      await alfrescoLogout();
    } catch {
      clearTicket();
    }
    setIsLogged(false);
    setLocation("/login");
  };

  return {
    isLogged,
    login,
    logout,
    user: isLogged ? { name: "أحمد محمد" } : null,
  };
}
