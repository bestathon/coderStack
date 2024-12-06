import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkUser } from "../middlewares/openAuth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { deleteCard, getAllCards, getCardById, getFollowedVideos, getUserCards, publishACard, updateCard } from "../controllers/post.controller.js";

const router = Router();

router.route("/").get(getAllCards);
router.route("/c/:userId").get(getUserCards)
router.route("/:cardId").get(checkUser, getCardById);

router.use(verifyJWT);

router.route("/").post(
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1,
        },
    ]),
    publishACard
);

router
    .route("/:cardId")
    .delete(deleteCard)
    .patch(updateCard);
    
router.route("/s/following").get(getFollowedVideos);

export default router;