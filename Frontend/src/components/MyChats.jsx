import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../context/chatProvider";
import { Avatar, Button, ListGroup } from "flowbite-react";
import { useSelector } from "react-redux";
import { getLastSender, getSender, getSenderfull } from "../config/Chatlogic";
import { FaPlus } from "react-icons/fa";
import CreateGrpModal from "../miscallaneous/CreateGrpModal";

const MyChats = () => {
  const { chats, setChats, selectedChat, setSelectedChat, Renderchat } = ChatState();
  const { currentUser } = useSelector((state) => state.user);
  const [showGrpModal, setshowGrpModal] = useState(false);

  useEffect(() => {
    const fetchAllChats = async () => {
      try {
        const { data } = await axios.get("/api/chat/getuserchats");
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllChats();
  }, [Renderchat]);

  return (
    <div
      className={` ${
        selectedChat?._id ? `hidden sm:block` : ``
      } w-full  sm:max-w-sm mx-auto overflow-y-clip bg-white h-full`}
    >
      <div className="flex justify-between items-center mb-5 ">
        <span className="text-2xl mx-2">Your Chats</span>
        <div
          className="flex gap-2 items-center border p-2 hover:bg-green-500 hover:text-white"
          onClick={() => setshowGrpModal(true)}
        >
          <span>
            <FaPlus />
          </span>
          <p>Create new Group</p>
        </div>
      </div>
      <CreateGrpModal showModal={showGrpModal} closeModal={setshowGrpModal} />
      <div className="overflow-y-scroll overflow-x-hidden h-[90%] ">
        <ListGroup className=" border-none ">
          {chats &&
            chats.map((chat) => (
              <ListGroup.Item
                key={chat._id}
                active={selectedChat?._id === chat?._id}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="flex gap-3">
                  <div className="flex items-center w-10">
                  {!chat.isGroupChat ? (
                    <Avatar
                      img={getSenderfull(currentUser, chat.users).pic}
                      rounded
                    />
                  ) : (
                    <Avatar
                      img="https://img.freepik.com/free-vector/user-group-with-shadow_78370-7019.jpg?"
                      rounded
                    />
                  )}
                  </div>
                  <div className="flex flex-col justify-start items-start ml-2 ">
                    <p className="py-2 text-md ">
                      {!chat.isGroupChat
                        ? getSender(currentUser, chat.users)
                        : chat.chatName}
                    </p>
                    <div className="text-xs font-normal truncate">
                      {chat?.latestMessage?.sender
                        ? chat?.latestMessage?.sender === currentUser?._id
                          ? "you : "
                          : getLastSender(
                              chat?.latestMessage?.sender,
                              chat?.users
                            ) || 'removed user' + " : "
                        : "Send your first message"}
                      <span> {chat?.latestMessage?.content}</span>
                    </div>
                  </div>
                </div>
              </ListGroup.Item>
            ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default MyChats;
