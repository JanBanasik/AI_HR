
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "recruiter";
  avatarUrl?: string;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for an existing user session on page load
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem("cvision-user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth status error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call to your backend
      // Mock implementation for demonstration
      if (email === "admin@cvision.com" && password === "password") {
        const userData: User = {
          id: "1",
          email: "admin@cvision.com",
          name: "Admin User",
          role: "admin",
          avatarUrl: "https://ui-avatars.com/api/?name=Admin+User&background=6D28D9&color=fff",
        };
        
        setUser(userData);
        localStorage.setItem("cvision-user", JSON.stringify(userData));
        toast({
          title: "Login successful",
          description: `Welcome back, ${userData.name}!`,
        });
        return true;
      }
      
      if (email === "recruiter@cvision.com" && password === "password") {
        const userData: User = {
          id: "2",
          email: "recruiter@cvision.com",
          name: "Recruiter User",
          role: "recruiter",
          avatarUrl: "https://ui-avatars.com/api/?name=Recruiter+User&background=6D28D9&color=fff",
        };
        
        setUser(userData);
        localStorage.setItem("cvision-user", JSON.stringify(userData));
        toast({
          title: "Login successful",
          description: `Welcome back, ${userData.name}!`,
        });
        return true;
      }
      
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("cvision-user");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call to your backend
      // Mock implementation for demonstration
      if (email) {
        toast({
          title: "Password reset email sent",
          description: `If an account exists for ${email}, we have sent a password reset link.`,
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Forgot password error:", error);
      toast({
        title: "Request failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // In a real app, this would be an API call to your backend
      // Mock implementation for demonstration
      if (token && password) {
        toast({
          title: "Password updated",
          description: "Your password has been successfully updated. You can now log in with your new password.",
        });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        title: "Reset failed",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        forgotPassword,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
