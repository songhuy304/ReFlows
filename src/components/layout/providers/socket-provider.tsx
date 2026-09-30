"use client";
import { NotificationListener } from "@/features/notifications/listeners/notification-listener";
import { useAppSelector } from "@/hooks/useRedux";
import { tokenStorage } from "@/lib/auth";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { selectIsAuthenticated } from "@/store";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: ReactNode }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      setSocket(null);
      return;
    }

    const accessToken = tokenStorage.getAccess();

    if (!accessToken) {
      disconnectSocket();
      setSocket(null);
      return;
    }

    const socketInstance = connectSocket(accessToken);
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socketInstance.on("connect_error", (err) => {
      console.log("🚨 Connect error:", err.message);
    });

    return () => {
      socketInstance.off("connect");
      socketInstance.off("disconnect");
      socketInstance.off("connect_error");

      disconnectSocket();
      setSocket(null);
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket }}>
      <NotificationListener />
      {children}
    </SocketContext.Provider>
  );
}
