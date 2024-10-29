import { Router } from "express";
import { userSignin, userSignup, searchUsers,SignOut } from "../controllers/user.controllers.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = Router()

router.post('/signup', userSignup)
router.post('/signin', userSignin)
router.get('/search', verifyUser,  searchUsers)
router.post('/signout', SignOut)

export default router;
