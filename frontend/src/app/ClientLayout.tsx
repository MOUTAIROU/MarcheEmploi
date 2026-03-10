"use client";

import { ReactNode } from "react";
import SocketHandler from "@/components/SocketHandler/SocketHandler";
import { SessionProvider } from "@/lib/sessionStore";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SocketHandler />
      {children}
    </SessionProvider>
  );
}
