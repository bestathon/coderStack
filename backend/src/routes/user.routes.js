import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getCurrentUser, getUserChannelProfile, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(
    registerUser
)

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/c/:username").get(verifyJWT, getUserChannelProfile)

export default router
