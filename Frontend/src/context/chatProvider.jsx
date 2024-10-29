import { createContext, useContext, useState } from "react";

const chatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState([]);
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const [Renderchat, setRenderchat] = useState(0);

  return (
    <chatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification, 
        setNotification,
        Renderchat,
        setRenderchat
      }}
    >
      {children}
    </chatContext.Provider>
  );
};

export const ChatState = () => {
    return useContext(chatContext);
  };

export default ChatProvider;
