import { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isOpen: boolean;
  openAuth: () => void;
  closeAuth: () => void;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const login = (email: string, _password: string) => {
    // Simular login - sem validação real
    const name = email.split('@')[0];
    setUser({ email, name: name.charAt(0).toUpperCase() + name.slice(1) });
    setIsOpen(false);
  };

  const signup = (name: string, email: string, _password: string) => {
    // Simular signup - sem validação real
    setUser({ email, name });
    setIsOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isOpen,
        openAuth: () => setIsOpen(true),
        closeAuth: () => setIsOpen(false),
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
