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
    // Quick check for existing session without extended loading
    const savedUser = localStorage.getItem("finsync_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("finsync_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Show loading screen for exactly 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));
      
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
      // Show loading screen for exactly 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));
      
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
