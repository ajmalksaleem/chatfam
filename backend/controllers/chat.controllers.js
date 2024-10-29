import Chat from "../models/chat.model.js";
import { errorHandler } from "../utils/error.js";
import User from "../models/user.model.js";

export const createChat = async (req, res, next) => {
  const { userId } = req.body;
  try {
    if (!userId) return next(errorHandler(400, "bad request"));
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user.id } } },
        { users: { $elemMatch: { $eq: req.body.userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
    isChat = await User.populate(isChat, {
      path: "lastMessage.sender",
      select: "name pic email",
    });
    if (isChat.length > 0) {
      res.status(200).json(isChat[0]);
    } else {
      const chatData = {
        chatName: "sender",
        users: [req.user.id, userId],
        isGroupChat: false,
      };
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(FullChat);
    }
  } catch (error) {
    next(error);
  }
};

export const getUserChats = async (req, res, next) => {
  try {
    let userChats = await Chat.find({
      users: { $elemMatch: { $eq: req.user.id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    userChats = await User.populate(userChats, {
      path: "lastMessage.sender",
      select: "name pic email",
    });
    res.status(200).json(userChats);
  } catch (error) {
    next(error);
  }
};

export const createGroupChat = async (req, res, next) => {
  if (!req.body.groupName || !req.body.users) {
    return next(errorHandler(400, "require all fields"));
  }
  try {
    const { users } = req.body;
    if (users.length < 2) {
      return next(
        errorHandler(
          400,
          "more than 2 users are required to start a group chat"
        )
      );
    }
    users.push(req.user.id);
    const groupChat = await Chat.create({
      chatName: req.body.groupName,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user.id,
    });
    await groupChat.populate("users groupAdmin", "-password");
    res.status(201).json(groupChat);
  } catch (error) {
    next(error);
  }
};

export const renameGroupChat = async (req, res, next) => {
  try {
    const { chatId, groupName, user } = req.body;

    // Input validation
    if (!chatId || !groupName) {
      return next(errorHandler(400, "Chat ID and group name are required"));
    }

    // Verify user ownership
    if (req.user.id !== user._id.toString()) {
      return next(errorHandler(403, "Unauthorized"));
    }

    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) {
      return next(errorHandler(404, "Chat not found"));
    }

    // Verify user is group admin
    if (chat.groupAdmin.toString() !== req.user.id) {
      return next(errorHandler(403, "Only group admins can rename"));
    }

    // Update chat name
    const updatedData = await Chat.findByIdAndUpdate(
      chatId,
      { $set: { chatName: groupName } },
      { new: true }
    ).populate("users groupAdmin", "-password");

    if (!updatedData) {
      return next(errorHandler(404, "Chat not found"));
    }

    res.status(200).json(updatedData);
  } catch (error) {
    next(errorHandler(500, "Internal Server Error"));
  }
};

export const updateGroupMembers = async (req, res, next) => {
 try {
  const { users, currentUser, chatId } = req.body;
  if (!users) return next(errorHandler(400, "no users to update"));
  if (req.user.id !== currentUser._id.toString()) {
    return next(errorHandler(400, "you cant update this group"));
  }
  const chat = await Chat.findOne({ _id: chatId });
  if (!chat) {
    return next(errorHandler(404, "Chat not found"));
  }

  // Verify user is group admin
  if (chat.groupAdmin.toString() !== req.user.id) {
    return next(errorHandler(403, "Only group admins can update group"));
  }
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {$set : {users}},
    {new : true}
  )
  await updatedChat.populate("users groupAdmin", "-password");
  res.status(200).json(updatedChat)
 } catch (error) {
  next(error)
 }
};

export const deleteChat = async(req,res,next)=>{
  try {
    const {currentUser, chatId } = req.body;
    if (!chatId || !currentUser) return next(errorHandler(400, "unable to delete"));
    if (req.user.id !== currentUser._id.toString()) {
      return next(errorHandler(400, "you cant update this group"));
    }
    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) {
      return next(errorHandler(404, "Chat not found"));
    }
  
    // Verify user is group admin
    if (chat.groupAdmin.toString() !== req.user.id) {
      return next(errorHandler(403, "Only group admins can update group"));
    }
await Chat.findByIdAndDelete(chatId)
res.status(200).json('group deleted successfully')
  } catch (error) {
    next(error)
  }
}

// export const addToGroup = async (req, res, next) => {
//   const { chatId, userId } = req.body;

//   if (!chatId || !userId) {
//     return next(errorHandler(400, 'Chat ID and userId are required'));
//   }

//   try {
//     const groupData = await Chat.findByIdAndUpdate(
//       chatId,
//       { $addToSet: { users: userId } },
//       { new: true }
//     ).populate('users groupAdmin', '-password');

//     if (!groupData) {
//       return next(errorHandler(404, 'Chat not found'));
//     }

//     res.status(200).json(groupData);
//   } catch (error) {
//     next(error);
//   }
// };

// export const removeFromGroup = async (req, res, next) => {
//   const { chatId, userId } = req.body;

//   if (!chatId || !userId) {
//     return next(errorHandler(400, 'Chat ID and userId are required'));
//   }

//   try {
//     const groupData = await Chat.findByIdAndUpdate(
//       chatId,
//       { $pull: { users: userId } },
//       { new: true }
//     ).populate('users groupAdmin', '-password');

//     if (!groupData) {
//       return next(errorHandler(404, 'Chat not found'));
//     }

//     res.status(200).json(groupData);
//   } catch (error) {
//     next(error);
//   }
// };
