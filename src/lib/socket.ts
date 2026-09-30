import { NEXT_PUBLIC_SOCKET_URL } from "@/config/app.config";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (socket?.connected) {
    return socket;
  }

  socket = io(NEXT_PUBLIC_SOCKET_URL, {
    auth: {
      token,
    },

    transports: ["websocket"],
    autoConnect: true,
    reconnectionAttempts: 5,
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  socket?.disconnect();
  socket = null;
};
