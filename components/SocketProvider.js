"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket-client";

export default function SocketProvider({ children }) {
  useEffect(() => {
    const socket = getSocket();

    socket.connect();

    socket.on("connect", () => {
      console.log(
        "Socket connected:",
        socket.id
      );
    });

    socket.on("connect_error", (error) => {
      console.error(
        "Socket connection error:",
        error.message
      );
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, []);

  return children;
}