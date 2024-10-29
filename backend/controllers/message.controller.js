import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const SendMessage = async (req,res,next) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) return next(errorHandler(400, "invalid request"));
  const newMessage = {
    sender: req.user.id,
    content,
    chat: chatId,
  };
  try {
   const message = await Message.create(newMessage)
   await message.populate('sender', 'name pic')
   await message.populate('chat')
   await User.populate(message, {
    path: "chat.users",
    select: "name pic email",
  });
  await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
  res.status(201).json(message)
  } catch (error) {
    next(error)
  }
};

export const getAllMessages = async(req,res,next)=>{
    const {chatId} = req.params
   try {
    const messages = await Message.find({chat : chatId})
    .populate('sender','name pic')
    .populate('chat')  
      res.status(200).json(messages)
   } catch (error) {
    next(error)
   }
}