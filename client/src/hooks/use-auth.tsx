import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocation } from "wouter";

interface User {
  id: string;
  email: string;
  name: string;
  company?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Check for existing session on app start with extended loading time
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem("finsync_user");
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          // Clear invalid data if JSON parsing fails
          localStorage.removeItem("finsync_user");
        }
      }
      
      // Add minimum loading time of 3-5 seconds for better UX
      const minLoadTime = 3000 + Math.random() * 2000; // 3-5 seconds
      await new Promise(resolve => setTimeout(resolve, minLoadTime));
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Extended loading time for better loading screen experience
      const loadingTime = 3500 + Math.random() * 1500; // 3.5-5 seconds
      await new Promise(resolve => setTimeout(resolve, loadingTime));
      
      const userData: User = {
        id: "1",
        email,
        name: "John Doe",
        company: "Tech Corp",
        avatar: "/api/placeholder/40/40"
      };
      
      setUser(userData);
      localStorage.setItem("finsync_user", JSON.stringify(userData));
      setLocation("/dashboard");
    } catch (error) {
      throw new Error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      // Extended loading time for registration
      const loadingTime = 4000 + Math.random() * 1000; // 4-5 seconds
      await new Promise(resolve => setTimeout(resolve, loadingTime));
      
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name,
        company: userData.company,
        avatar: "/api/placeholder/40/40"
      };
      
      setUser(newUser);
      localStorage.setItem("finsync_user", JSON.stringify(newUser));
      setLocation("/dashboard");
    } catch (error) {
      throw new Error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("finsync_user");
    localStorage.clear(); // Clear all localStorage data
    setLocation("/");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
