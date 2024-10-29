import { Drawer, ListGroup, TextInput } from "flowbite-react";
import {  useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
import axios from "axios";
import { Spinner } from "flowbite-react";
import { ChatState } from "../context/chatProvider";

const UserDrawer = ({ showDrawer, setshowDrawer }) => {
  const [search, setsearch] = useState(null);
  const [Searchdata, setSearchdata] = useState([]);
  const [Loading, setLoading] = useState(false);
  const {selectedChat, setSelectedChat,chats, setChats} = ChatState()

  const handlecloseDrawer = () => {
    setshowDrawer(false);
  };

  useEffect(() => {
    const searchUser = async () => {
      setSearchdata([]);
      if (!search) return;
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/user/search?search=${search}`);
        setSearchdata(data);
        setLoading(false);
      } catch (error) {
        console.log(error.response.data.message);
        setLoading(false);
      }
    };
    searchUser();
  }, [search]);

  const handleAcessChat = async(userId) => {
      try {
        const {data} = await axios.post(`/api/chat/createchat`,{
          userId
        })
        setSelectedChat(data)
        if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
        setshowDrawer(false);
      } catch (error) {
        console.log(error.response.data.message)
      }
  };

  return (
    <Drawer open={showDrawer} onClose={handlecloseDrawer}>
      <Drawer.Header title="Search" />
      <Drawer.Items className="">
        <div className="">
          <TextInput
            placeholder="Search"
            addon={<CiSearch />}
            onChange={(e) => setsearch(e.target.value)}
            required
          />
        </div>

        {Loading ? (
          <div className="flex justify-center mt-20 ">
            <Spinner />
          </div>
        ) : Searchdata.length > 0 ? (
          <ListGroup className="full mt-5">
            {Searchdata.map((user) => (
              <ListGroup.Item
                key={user._id}
                onClick={() => handleAcessChat(user._id)}
              >
                <img
                  src={user.pic}
                  alt="user"
                  className="h-8 w-8 rounded-full"
                />
                <p className="text-md truncate ml-3 font-semibold">
                  {user.name}
                </p>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="text-slate-500 text-center mt-5">no results</p>
        )}
      </Drawer.Items>
    </Drawer>
  );
};

export default UserDrawer;
