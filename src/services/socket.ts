
import { io, Socket } from 'socket.io-client';

const URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';
let socket: Socket;

export const connectSocket = () => {
  socket = io(URL, { withCredentials: true });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};

export const sendMessage = (message: string) => {
  if (socket) {
    socket.emit('message', message);
  }
};

export const subscribeToMessages = (cb: (message: Message) => void) => {
  if (!socket) return;
  socket.on('message', (message: Message) => {
    cb(message);
  });
};

export const subscribeToError = (cb: (message: MySocketError) => void) => {
  if (!socket) return;
  socket.on('error', (message: MySocketError) => {
    cb(message);
  });
};

export const subscribeToGameStarted = (cb: (game: Game) => void) => {
  if (!socket) return;
  socket.on('gameStarted', (game: Game) => {

    cb(game);
  });
}

export const subscribeToOpenCalls = (cb: (openCall: OpenCall) => void) => {
  if (!socket) return;
  socket.on('newGame', (openCall: OpenCall) => {
    // console.log(openCall);
    cb(openCall);
  });
}


export const createGame = (timeControl: string) => {
  if (!socket) return;
  socket.emit('createGame', timeControl);
}