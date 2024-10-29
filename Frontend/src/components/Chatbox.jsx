import { Avatar, Button, Card, Spinner, TextInput } from "flowbite-react";
import { ChatState } from "../context/chatProvider";
import { IoSettings } from "react-icons/io5";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { getSender, isLastMessage, isSameSender } from "../config/Chatlogic";
import { useEffect, useRef, useState } from "react";
import { LuSendHorizonal } from "react-icons/lu";
import axios from "axios";
import io from "socket.io-client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import EditGrpModal from "../miscallaneous/EditGrpModal";

const ENDPOINT = "https://chatfam.onrender.com";
let socket, selectedChatCompare;

const Chatbox = () => {
  const [socketConnected, setSocketConnected] = useState(false);
  const [loading, setloading] = useState(false);
  const [Newmessage, setNewmessage] = useState("");
  const [Messages, setMessages] = useState([]);
  const [typing, settyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [ShowEditModal, setShowEditModal] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const containerRef = useRef(null);
  const { selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const handleMessagesend = async (e) => {
    e.preventDefault();
    socket.emit("stop typing", selectedChat._id);
    if (!Newmessage) return;
    try {
      const { data } = await axios.post("/api/message/sendmessage", {
        content: Newmessage,
        chatId: selectedChat._id,
      });
      setNewmessage("");
      socket.emit("new message", data);
      setMessages([...Messages, data]);
      setTimeout(() => {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }, 100);
    } catch (error) {}
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", currentUser);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    const fetchAllmessages = async () => {
      if (!selectedChat._id) return;
      try {
        setloading(true);
        const { data } = await axios.get(
          `/api/message/getmessages/${selectedChat._id}`
        );
        setMessages(data);
        setloading(false);
        socket.emit("join chat", selectedChat._id);
        setTimeout(() => {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }, 100);
      } catch (error) {
        setloading(false);
      }
    };
    fetchAllmessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageRecieved) => {
      console.log(selectedChatCompare._id, "hello");
      console.log(newMessageRecieved._id);
      if (
        !selectedChatCompare._id ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
        }
      } else {
        setMessages([...Messages, newMessageRecieved]);
        setTimeout(() => {
          containerRef.current.scrollTop = containerRef?.current?.scrollHeight;
        }, 100);
      }
    });
  });

  const typingHandler = (e) => {
    setNewmessage(e.target.value);
    if (!socketConnected) return;
    if (!typing) {
      settyping(true);
      socket.emit("typing", selectedChat._id);
    }
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        //When the component mounts, typing is initially false. Without this check, a premature "stop typing" signal would be sent immediately after the 3-second timer expires,
        socket.emit("stop typing", selectedChat._id);
        settyping(false);
      }
    }, timerLength);
  };

  return (
    <div
      className={`flex-grow max-w-full h-full overflow-y-clip bg-green-100 rounded-lg ${
        !selectedChat._id ? `hidden sm:block` : ``
      }`}
    >
      {selectedChat._id ? (
        <>
          <div className="flex justify-between items-center m-3 px-3 ">
            <span
              className=" bg-green-500 hover:bg-green-800 p-1"
              onClick={() => setSelectedChat({})}
            >
              <IoMdArrowRoundBack className="text-xl text-white " />
            </span>
            <p className="font-semibold text-2xl mx-2">
              {selectedChat.isGroupChat
                ? selectedChat.chatName.toUpperCase()
                : getSender(currentUser, selectedChat.users).toUpperCase()}
            </p>
            {selectedChat?.isGroupChat && (
            <IoSettings className="text-xl" onClick={()=>setShowEditModal(true)}/>
            )}
          </div>
          <EditGrpModal showModal={ShowEditModal} setShowmodal={setShowEditModal}/>
          <Card className="mx-2 mt-3  h-[87%]">
            {loading ? (
              <div className="mx-auto">
                <Spinner size="lg" />
              </div>
            ) : (
              <div className=" h-full overflow-y-scroll" ref={containerRef}>
                {Messages.map((m, i) => (
                  <div
                    className={`flex gap-2 mx-2 pt-1 ${
                      m.sender._id === currentUser._id
                        ? "justify-end"
                        : "justify-start"
                    } mb-2`}
                    key={i}
                  >
                    {isSameSender(Messages, m, i, currentUser._id) ||
                    isLastMessage(Messages, i, currentUser._id) ? (
                      <>
                      <div className="flex flex-shrink-0">
                          <Avatar img={m.sender.pic} rounded className="" />
                          </div>
                        <span
                          className={`p-2 rounded-xl  ${
                            m.sender._id === currentUser._id
                              ? "bg-green-100 rounded-br-none"
                              : "bg-blue-100 rounded-bl-none"
                          }`}
                        >
                          {m.content}
                        </span>
                      </>
                    ) : (
                      <span
                        className={`p-2 ml-12 rounded-xl ${
                          m.sender._id === currentUser._id
                            ? "bg-green-100 rounded-br-none"
                            : "bg-blue-100 rounded-bl-none"
                        }`}
                      >
                        {m.content}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            {istyping && (
              <div className="flex h-20 w-20 ">
                <DotLottieReact
                  src="https://lottie.host/a6bde5e4-9682-4745-aae4-3e8647365270/L6NtiLeX6W.json"
                  loop
                  autoplay
                />
              </div>
            )}
            <form
              className="flex justify-center gap-2"
              onSubmit={handleMessagesend}
            >
              <TextInput
                className="w-full"
                value={Newmessage}
                onChange={typingHandler}
              />
              <Button type="submit" gradientMonochrome="success">
                <span>Send</span>
                <LuSendHorizonal className="mt-1 ml-2" />
              </Button>
            </form>
          </Card>
        </>
      ) : (
        <div className="max-w-lg h-full text-6xl flex text-center items-center mx-auto my-auto">
          <p className="">Select a chat to start texting</p>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
