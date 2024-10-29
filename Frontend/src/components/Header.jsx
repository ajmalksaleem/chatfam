import { useDispatch, useSelector } from "react-redux";
import { Avatar, Dropdown, Navbar } from "flowbite-react";
import { Button, Tooltip } from "flowbite-react";
import { IoSearch } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import UserDrawer from "./UserDrawer";
import { useState } from "react";
import { ChatState } from "../context/chatProvider";
import { getSender } from "../config/Chatlogic";
import axios from "axios";
import {clearUserDetails} from '../redux/userSlice'

const Header = () => {
  const [showDrawer, setshowDrawer] = useState(false);
  const { notification, setNotification, setSelectedChat } = ChatState();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleSignout = async () => {
    try {
      const  { data } = await axios.post("/api/user/signout");
      dispatch(clearUserDetails());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar
      fluid
      rounded
      className="h-[10%] bg-green-100 shadow overflow-y-auto"
    >
      <UserDrawer showDrawer={showDrawer} setshowDrawer={setshowDrawer} />
      <Tooltip content="Search User" placement="bottom">
        <Button
          gradientDuoTone="greenToBlue"
          onClick={() => setshowDrawer(true)}
          className="hidden sm:flex"
        >
          <div className="flex gap-1">
            <span>Search</span>
            <IoSearch className="mt-1" />
          </div>
        </Button>
      </Tooltip>
      <div className="sm:hidden flex" onClick={() => setshowDrawer(true)}>
      <IoSearch className="w-5 h-5"/>
      </div>
      <Navbar.Brand>
        <span className="self-center whitespace-nowrap text-2xl text-green-800 font-semibold dark:text-white">
          ChatFam
        </span>
      </Navbar.Brand>
      <span>
        <Dropdown
          arrowIcon={false}
          inline
          label={<div className="relative">
            <FaBell className="text-xl text-green-800" />
            {notification.length > 0 && (
              <span className="absolute top-0 right-0 -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full px-1  text-[10px]">
                {notification.length}
              </span>
            )}
          </div>}
        >
          {!notification.length && (
            <Dropdown.Item className="w-48">No new messages</Dropdown.Item>
          )}
          {notification?.map((noti) => (
            <Dropdown.Item
              key={noti._id}
              onClick={() => {
                setSelectedChat(noti.chat);
                setNotification(notification.filter((n) => n !== noti));
              }}
            >
              {noti.chat.isGroupChat
                ? `New message in group : ${noti.chat.chatName}`
                : `New message from ${getSender(currentUser, noti.chat.users)}`}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </span>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={<Avatar alt="User settings" img={currentUser.pic} rounded />}
        >
          <Dropdown.Header>
            <span className="block text-sm">{currentUser.name}</span>
            <span className="block truncate text-sm font-medium">
            {currentUser.email}
            </span>
          </Dropdown.Header>
          <Dropdown.Item>Profile</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
        </Dropdown>
      </div>
    </Navbar>
  );
};

export default Header;
