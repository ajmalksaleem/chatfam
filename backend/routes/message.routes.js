import { Router } from "express";
import { SendMessage,getAllMessages } from "../controllers/message.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = Router()

router.post('/sendmessage',verifyUser, SendMessage)
router.get('/getmessages/:chatId', verifyUser, getAllMessages)

export default router