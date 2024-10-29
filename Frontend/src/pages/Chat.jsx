import Chatbox from "../components/Chatbox";
import Header from "../components/Header";
import MyChats from "../components/MyChats";

const Chat = () => {
 
  return (
    <div className="w-full h-screen overflow-y-auto bg-slate-200">
      <Header/>
      <div className="flex justify-between w-full h-[90%]  flex-row gap-10  p-4 ">
        <MyChats/>
        <Chatbox />
      </div>
    </div>
  );
};

export default Chat;
