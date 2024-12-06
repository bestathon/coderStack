import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose, { isValidObjectId } from "mongoose";

const toggleCardLike = asyncHandler(async (req, res) => {
    const { cardId } = req.params;

    if (!cardId || !isValidObjectId(cardId)) {
        throw new ApiError(400, "No card Id found");
    }
    
    const isLiked = await Like.findOne({
        card: cardId,
        likedBy: req.user._id,
    });

    if (isLiked) {
        const removeLink = await Like.findByIdAndDelete(isLiked._id);
        if (!removeLink) {
            throw new ApiError(500, "Error error while removing like")
        }
    } else {
        const liked = await Like.create({
            card: cardId,
            likedBy: req.user._id,
        });

        if (!liked) {
            throw new ApiError(500, "Error while liking video");
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Like status updated"));

});

const getLikedCard = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const likedCard = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id),
            },
        },
        {
            $lookup: {
                from: "cards",
                localField: "card",
                foreignField: "_id",
                as: "card",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1,
                                    },
                                },
                            ],
                        },
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner",
                            },
                        },
                    },
                ],
            },
        },
        {
            $addFields: {
                video: {
                    $first: "$card",
                },
            },
        },
        {
            $sort: {
                createdAt: -1,
            },
        },
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: parseInt(limit),
        },
    ]);

    if (!likedCard) {
        throw new ApiError(500, "Error while fetching liked videos");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedCard,
                "Liked videos fetched successfully"
            )
        );
});

export { toggleCardLike, getLikedCard };