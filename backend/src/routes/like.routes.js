import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getLikedCard, toggleCardLike } from "../controllers/like.controller.js";


const router = Router();
router.use(verifyJWT);

router.route("/toggle/v/:cardId").post(toggleCardLike);
router.route("/cards").get(getLikedCard);

export default router;