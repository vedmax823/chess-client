import React, { useEffect, useState, useRef } from "react";
import {
  connectSocket,
  disconnectSocket,
  sendMessage,
  subscribeToMessages,
  subscribeToError
} from "../services/socket";
import axios from "axios";
import useStore from "../store/useUser";

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const user = useStore((state) => state.user);

  const messageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    connectSocket();
    subscribeToMessages((newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    subscribeToError((error : MySocketError) => {
      console.log(error);
    })

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/messages`)
      .then((response) => setMessages(response.data))
      .catch((error) => console.log("Error fetching messages:", error));

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = () => {
    // e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  return (
    <div>
      {user ? (
        <div className="bg-gray-100 h-screen flex items-center justify-center">
          <div className="bg-white w-full max-w-md shadow-lg rounded-lg overflow-hidden">
            <div className="bg-blue-600 text-white px-4 py-2">
              <h1 className="text-lg font-semibold">Chat</h1>
            </div>
            <div
              className="h-96 overflow-y-scroll p-4"
              ref={messageContainerRef}
            >
              <div className="flex flex-col space-y-2">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start ${
                      message.user.id === user.id ? "justify-end" : ""
                    }`}
                  >
                    {message.user.id !== user.id && (
                      <img
                        src={message.user.image}
                        alt="avatar"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                    )}
                    <div
                      className={`px-3 py-2 rounded-lg max-w-xs ${
                        message.user.id === user.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    {message.user.id === user.id && (
                      <img
                        src={message.user.image}
                        alt="avatar"
                        className="w-8 h-8 rounded-full ml-2"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-300 px-4 py-2">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                />
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-full"
                  onClick={handleSubmit}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Chat;
