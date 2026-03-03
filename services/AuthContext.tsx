import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Define what a "User" looks like
interface User {
  email: string;
  name: string;
}

// 2. Define what the Context provides
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 3. The Provider: This wraps your app so everyone can hear the "broadcast"
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. A custom "hook" to make using this easy later
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};