import { Router } from "express";
import { verifyUser } from "../utils/verifyUser.js";
import { createChat, getUserChats, createGroupChat,renameGroupChat,updateGroupMembers, deleteChat} from "../controllers/chat.controllers.js";

const router = Router()

 router.post('/createchat',verifyUser, createChat)
 router.get('/getuserchats',verifyUser, getUserChats)
router.post('/creategroupchat',verifyUser, createGroupChat)
router.put('/renamegroupchat',verifyUser,renameGroupChat)
router.put('/updategroup',verifyUser, updateGroupMembers)
router.delete('/deletechat', verifyUser, deleteChat)

export default router