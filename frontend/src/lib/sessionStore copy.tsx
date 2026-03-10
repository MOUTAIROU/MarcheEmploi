"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

// Type des props pour le provider
interface SessionProviderProps {
  children: ReactNode;
}

// Type du contexte
interface SessionContextType {
  accessToken: string | null;
  user: any; // tu peux remplacer 'any' par un type plus précis
  login: (data: { accessToken: string; user: any }) => void;
  logout: () => void;
}

// Crée le contexte avec un type générique
const SessionContext = createContext<SessionContextType | null>(null);

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const login = (data: { accessToken: string; user: any }) => {
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
  };

  return (
    <SessionContext.Provider value={{ accessToken, user, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

// Hook pour utiliser le contexte
export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
