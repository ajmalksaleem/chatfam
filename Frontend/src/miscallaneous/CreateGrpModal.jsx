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

const CreateGrpModal = ({ showModal, closeModal }) => {
  const [Searchdata, setSearchdata] = useState([]);
  const [Selectedusers, setSelectedusers] = useState([]);
  const [Groupname, setGroupname] = useState(null);

  const {selectedChat, setSelectedChat,chats, setChats} = ChatState()

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
    if (Selectedusers.includes(user)) {
      toast.dismiss();
      toast.error("user already added");
      return;
    }
    setSelectedusers([...Selectedusers, user]);
  };

  const UserDeselect = (user) => {
    setSelectedusers(Selectedusers.filter((u) => u._id !== user._id));
  };

  const handleSubmit = async()=>{
    if(!Groupname) return toast.error("Group Name is required")
        if(Selectedusers.length < 2) return toast.error("Select atleast 2 users for creating group")
    try {
        const{data} = await axios.post('/api/chat/creategroupchat',{
            groupName : Groupname,
            users : Selectedusers.map((user) => user._id)
        })
        setSelectedChat(data)
        setChats([data,...chats])
        setSelectedusers([])
        setGroupname(null)
        setSearchdata([])
        closeModal(false)
        toast.success(`${data.chatName} group created`)
    } catch (error) {
        
    }
  }

  return (
    <Modal show={showModal} size="md" onClose={() => closeModal(false)} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="space-y-6">
          <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Create group chat
          </h3>
          <div>
            <div className="mb-2 block">
              <Label value="Group name" />
            </div>
            <TextInput placeholder="Group chat name" required
            onChange={(e)=>setGroupname(e.target.value)} />
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
              {Selectedusers.map((user) => (
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
          <div className="w-full flex justify-end ">
            <Button gradientDuoTone="greenToBlue" className="my-3" type="submit" onClick={handleSubmit}>
              Create Group Chat
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CreateGrpModal;
