"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { tokenStore } from "./tokenStore";

export type Session = {
  id: string;
  email?: string;
  role?: string;
  nom?: string;
  // ajoute ce que tu veux
};

// Type du contexte
type SessionContextType = {
  session: Session | null;
  setSession: (session: Session | null) => void;
  newAccessToken: (new_refreshToken: string) => void;
  accessToken: string | null;
  refreshToken: string | null;
  user: any; // tu peux remplacer 'any' par un type plus précis
  login: (data: { accessToken: string; refreshToken: string; user: any }) => void;
  logout: () => void;
};


const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {

  const [session, setSession] = useState<Session | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const newAccessToken = (new_refreshToken: string) => {
    setAccessToken(new_refreshToken)
  }

  // 🔥 Fonction interne pour synchroniser tokens localement + tokenStore
  const setTokens = ({
    accessToken,
    refreshToken,
  }: {
    accessToken?: string;
    refreshToken?: string;
  }) => {
    if (accessToken !== undefined) setAccessToken(accessToken);
    if (refreshToken !== undefined) setRefreshToken(refreshToken);

    tokenStore.setTokens({ accessToken, refreshToken });
  };



  const login = (data: { accessToken: string; refreshToken: string; user: any }) => {
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser(data.user);
    setTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    // Mettre à jour session
    setSession({
      id: data.user.id,
      email: data.user.email,
      role: data.user.role,
      nom: data.user.nom
      // ajoute d'autres champs si nécessaire
    });

  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
  };


  return (
    <SessionContext.Provider value={{ session, setSession, accessToken, refreshToken, user, login, logout, newAccessToken }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used inside a SessionProvider");
  }
  return context;
}
