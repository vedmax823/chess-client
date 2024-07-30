// src/socketService.ts
import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

class SocketService {
  socket: Socket | null = null;

  connect() {
    // console.log("connection", this.socket)
      this.socket = io(SOCKET_URL, { 
        withCredentials: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  on(event: string, callback: (data: any) => void) {
    // console.log('socket', this.socket);   
    this.socket?.on(event, callback);
  }

  emit<T>(event: string, data: T) {
    // console.log('socket', this.socket)
    this.socket?.emit(event, data);
  }

  off(event: string, callback: (data: any) => void) {
    this.socket?.off(event, callback);
  }
}

const socketService = new SocketService();
export default socketService;
