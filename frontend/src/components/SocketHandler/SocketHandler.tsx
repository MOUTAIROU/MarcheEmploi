"use client";

import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { useSession } from "@/lib/sessionStore";

export default function SocketHandler() {
  const { session } = useSession();
  const [socketConnected, setSocketConnected] = useState(false);

  

  useEffect(() => {
    // Si pas de session ou socket déjà connecté → ne rien faire
    if (!session?.id || socketConnected) return;
    

    const socket = getSocket();

    const handleConnect = () => {
     
      console.log("SOCKET CONNECTED:", socket.id);
      socket.emit("register", session.id);
      console.log("User enregistré côté socket :", session.id);
      setSocketConnected(true); // Marque comme connecté
    };

    socket.on("connect", handleConnect);

    socket.on("reconnect", () => {
      if (session?.id) {
        socket.emit("register", session.id);
        console.log("User ré-enregistré après reconnexion :", session.id);
      }
    });

    // Écoute des events envoyés à sa room
    socket.on("USER_ROOM_IN", (data: any) => {
      console.log("Notification reçue:", data);
      
    });

    return () => {
      socket.off("connect", handleConnect);
      socket.off("USER_ROOM_IN");
    };
  }, [session?.id]);

  return null;
}
