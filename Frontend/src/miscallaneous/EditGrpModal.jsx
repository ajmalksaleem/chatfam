import axios from "axios";
import {
  Badge,
  Button,
  Label,
  ListGroup,
  Modal,
  TextInput,
} from "flowbite-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { TiTimes } from "react-icons/ti";
import { ChatState } from "../context/chatProvider";
import { useSelector } from "react-redux";
import { GrUserAdmin } from "react-icons/gr";

const EditGrpModal = ({ showModal, setShowmodal }) => {
  const {
    selectedChat,
    setSelectedChat,
    Renderchat,
    setRenderchat,
  } = ChatState();
  const { currentUser } = useSelector((state) => state.user);

  const [Searchdata, setSearchdata] = useState([]);
  const [Selectedusers, setSelectedusers] = useState(selectedChat.users);
  const [Groupname, setGroupname] = useState(null);

  const handleSearch = async (search) => {
    setSearchdata([]);
    if (!search) return;
    try {
      const { data } = await axios.get(`/api/user/search?search=${search}`);
      setSearchdata(data);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };


  const handleAddtoGrp = (user) => {
    const existingUser = Selectedusers.find((u) => u._id === user._id);
    if (existingUser) return toast.error("User already added");
    setSelectedusers([...Selectedusers, user]);
  };


  const UserDeselect = (user) => {
    toast.dismiss();
    if (Selectedusers.length < 4) {
      toast.error("Atleast 2 members needed for group Delete group instead");
      return;
    }
    setSelectedusers(Selectedusers.filter((u) => u._id !== user._id));
  };


  const handleChangeName = async () => {
    if (!Groupname) return;
    try {
      const { data } = await axios.put("/api/chat/renamegroupchat", {
        chatId: selectedChat._id,
        groupName: Groupname,
        user: currentUser,
      });
      setGroupname(null);
      setSelectedChat(data);
      setRenderchat(Renderchat + 1);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };


  const handleSubmit = async () => {
    try {
    const userIds = Selectedusers.map((user)=>user._id)
      const{data} = await axios.put('/api/chat/updategroup',{
        users : userIds,
        currentUser,
        chatId : selectedChat._id
      })
      setRenderchat(Renderchat + 1);
      setSelectedChat(data)
      setShowmodal(false)
      setSearchdata([])
     toast.success(`${data.chatName} group updated`)
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  };


  const handleDeleteGroup = async()=>{
    try {
    await axios.delete('/api/chat/deletechat', {
      data: {
        currentUser,
        chatId: selectedChat._id
      }
      })
      setSelectedChat([])
      setRenderchat(Renderchat + 1);
      setShowmodal(false)
      setSearchdata([])
      toast.success(`Group deleted`)
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }

  return (
    <Modal show={showModal} size="md" onClose={() => setShowmodal(false)} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-2xl font-medium  text-gray-900 dark:text-white">
            {selectedChat?.chatName}
          </h3>
          <span className="flex gap-2 items-center">
            <p>Admin : </p>
            <Badge
              size="sm"
              icon={GrUserAdmin}
              color="success"
              className=" rounded-lg"
            >
              {selectedChat?.groupAdmin?.name}
            </Badge>
          </span>
          {selectedChat?.groupAdmin?._id === currentUser._id ? (
            <>
              <div className="flex gap-2 just">
                <TextInput
                  placeholder="Group chat name"
                  value={Groupname ? Groupname : ""}
                  required
                  onChange={(e) => setGroupname(e.target.value)}
                />
                <Button gradientDuoTone="tealToLime" onClick={handleChangeName}>
                  Change
                </Button>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label value="Add users" />
                </div>
                <TextInput
                  placeholder="Add Users eg : john, david .."
                  required
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              {Selectedusers?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {Selectedusers.filter(
                    (user) => user._id !== selectedChat.groupAdmin._id
                  ).map((user) => (
                    <Badge
                      icon={TiTimes}
                      color="purple"
                      className="px-3 rounded-lg hover:bg-pink-100"
                      onClick={() => UserDeselect(user)}
                    >
                      {user.name}
                    </Badge>
                  ))}
                </div>
              )}

              {Searchdata.length > 0 && (
                <ListGroup className="full mt-5">
                  {Searchdata.slice(0, 4).map((user) => (
                    <ListGroup.Item
                      key={user._id}
                      onClick={() => handleAddtoGrp(user)}
                    >
                      <img
                        src={user.pic}
                        alt="user"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <p className="text-md truncate ml-3 font-semibold">
                        {user.name}
                      </p>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </>
          ) : (
            <div className="flex flex-col justify-center items-center gap-3">
              <p className="text-slate-500 text-sm">Group members : </p>
              {Selectedusers?.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {Selectedusers.map((user) => (
                    <Badge
                      color="purple"
                      className="px-3 rounded-lg hover:bg-pink-100"
                    >
                      {user.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {selectedChat?.groupAdmin?._id === currentUser._id ? (
            <div className="flex justify-between items-center">
              <Button gradientMonochrome="failure" className="my-3" onClick={handleDeleteGroup}>
                Delete Group
              </Button>
              <Button
                gradientDuoTone="greenToBlue"
                className="my-3"
                onClick={handleSubmit}
              >
                Update Chat
              </Button>
            </div>
          ) : (
            <div className="w-full flex justify-end ">
              <Button
                gradientMonochrome="failure"
                className="my-3"
                type="submit"
              >
                Leave Group
              </Button>
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditGrpModal;
