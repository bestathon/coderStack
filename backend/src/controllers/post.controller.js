import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { isValidObjectId } from "mongoose";
import {
    deleteFromCloudinary,
    uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { Card } from "../models/card.model.js";
import { User } from "../models/user.model.js";
import fs from "fs";
import { Follow } from "../models/follow.model.js";

function unlinkPath(filePath) {
    if (filePath) fs.unlinkSync(filePath);
}

const publishACard = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const videoLocalPath = req.files?.videoFile[0]?.path;

    if (!title || title.trim() === "") {
        unlinkPath(videoLocalPath);
        throw new ApiError(400, "Title is required");
    }

    if (!videoLocalPath) {
        unlinkPath(videoLocalPath);
        throw new ApiError(400, "video file is required");
    }

    const videoFile = await uploadOnCloudinary(videoLocalPath);

    if (!videoFile) {
        throw new ApiError(400, "Video file is missing");
    }

    const card = await Card.create({
        file: videoFile?.url,
        title,
        duration: videoFile?.duration,
        description: description || "Nothing Written by the User",
        owner: req.user?._id,
    })

    if (!card) {
        throw new ApiError(500, "Error while uploading video");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, card, "Video uploaded successfully"));
});

const getCardById = asyncHandler(async (req, res) => {
    const { cardId } = req.params;

    if (!cardId || !mongoose.isValidObjectId(cardId)) {
        throw new ApiError(400, "Invalid video Id");
    }

    const card = await Card.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(cardId),
            },
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "card",
                as: "likes",
            },
        },
        {
            $addFields: {
                likesCount: {
                    $size: "$likes",
                },
                isLiked: {
                    $cond: {
                        if: { $in: [req.user?._id, "$likes.likedBy"] },
                        then: true,
                        else: false,
                    },
                },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $lookup: {
                            from: "follows",
                            localField: "_id",
                            foreignField: "following",
                            as: "followers"
                        }
                    },
                    {
                        $addFields: {
                            followerCount: {
                                $size: "$followers",
                            },
                            isFollow: {
                                $cond: {
                                    if: { $in: [req.user?._id, "$followers.follower"] },
                                    then: true,
                                    else: false,
                                },
                            },
                        },
                    },
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1,
                            followerCount: 1,
                            isFollow: 1,
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
        {
            $project: {
                file: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                owner: 1,
                createdAt: 1,
                comments: 1,
                likesCount: 1,
                isLiked: 1,
            },
        },
    ]);

    if (!card.length) {
        throw new ApiError(404, "Video does not exists");
    }

    await Card.findByIdAndUpdate(cardId, {
        $inc: { views: 1 },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, card[0], "Video fetched successfully"));
});

const updateCard = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const { cardId } = req.params;

    if (!cardId || !isValidObjectId(cardId)) {
        throw new ApiError(400, "Invalid video Id");
    }

    if (!title && !description) {
        throw new ApiError(400, "At least one field is required");
    }

    const card = await Card.findById(cardId);
    if (!card) {
        throw new ApiError(404, "Card not found");
    }

    if (req.user?._id.toString() !== card?.owner.toString()) {
        throw new ApiError(
            401,
            "You do not have permission to perform this action"
        );
    }

    const updatedCard = await Card.findByIdAndUpdate(
        cardId,
        {
            $set: {
                title: title || card?.title,
                description: description || card?.description,
            },
        },
        {
            new: true,
        }
    );

    if (!updatedCard) {
        throw new ApiError(500, "Error while updating card");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedCard, "Video updated successfully"));
});

const deleteCard = asyncHandler(async (req, res) => {
    const { cardId } = req.params;
    if (!cardId || !isValidObjectId(cardId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const card = await Card.findById(cardId);
    if (!card) {
        throw new ApiError(404, "Video not found");
    }

    if (card?.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(401, "You do not have permission to delete this card");
    }
    
    const videoFileUrl = card?.file;
    console.log(videoFileUrl);
    
    const regex = /\/([^/]+)\.[^.]+$/;
    let match = videoFileUrl.match(regex);
    if (!match) {
        throw new ApiError(400, "Couldn't find Public ID of Card");
    }
    let publicId = match[1];
    const deleteVideoFile = await deleteFromCloudinary(publicId, "video");
    
    if (deleteVideoFile.result !== "ok") {
        throw new ApiError(500, "Error while deleting video from Cloudinary");
    }

    await Card.findByIdAndDelete(cardId);
    
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video deleted successfully"));
})

const getFollowedVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortType = "desc" } = req.query;

    const followings = await Follow.find({
        follower: new mongoose.Types.ObjectId(req.user?._id),
    }).select("following")

    const channelIds = followings.map((sub) => sub.channel);

    if (channelIds.length === 0) {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No Followed channels found"));
    }

    const cards = await Card.aggregate([
        {
            $match: {
                owner: {
                    $in: channelIds.map(
                        (id) => new mongoose.Types.ObjectId(id),
                    ),
                }
            },
        },
        {
            $sort: {
                createdAt: sortType === "asc" ? 1 : -1,
            },
        },
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: parseInt(limit),
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            avatar: 1,
                            username: 1,
                            fullName: 1,
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
        {
            $project: {
                _id: 1,
                owner: 1,
                file: 1,
                createdAt: 1,
                description: 1,
                title: 1,
                duration: 1,
                views: 1,
            },
        },
    ]);

    if (!cards) {
        throw new ApiError(404, "Error while fetching videos");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                cards,
                "Subscribed Cards fetched successfully"
            )
        );
})

const getAllCards = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query,
        sortBy = "createdAt",
        sortType = "desc",
    } = req.query;

    const cards = await Card.aggregate([
        ...(query
            ? [
                {
                    $match: {
                        $or: [
                            { title: { $regex: query, $options: "i" } },
                            { description: { $regex: query, $options: "i" } },
                        ]
                    },
                }
            ] : []),
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            avatar: 1,
                            username: 1,
                            fullName: 1,
                        },
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner",
                },
            }
        },
        {
            $project: {
                _id: 1,
                owner: 1,
                file: 1,
                createdAt: 1,
                description: 1,
                title: 1,
                duration: 1,
                views: 1,
            },
        },
        {
            $sort: {
                [sortBy]: sortType === "asc" ? 1 : -1,
            },
        },
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: parseInt(limit),
        },
    ]);

    if (!cards) {
        throw new ApiError(404, "No videos found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, cards, "Videos fetched successfully"));
})

const getUserCards = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sortType = "desc" } = req.query;
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user Id");
    }

    const cards = await Card.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId),
            },
        },
        {
            $sort: {
                createdAt: sortType === "asc" ? 1 : -1,
            }
        },
        {
            $skip: (page - 1) * limit,
        },
        {
            $limit: parseInt(limit),
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            avatar: 1,
                            username: 1,
                            fullName: 1,
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
        {
            $project: {
                _id: 1,
                owner: 1,
                file: 1,
                createdAt: 1,
                description: 1,
                title: 1,
                duration: 1,
                views: 1,
            },
        },
    ]);

    if (!cards) {
        throw new ApiError(404, "Error while fetching videos");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, cards, "Videos fetched successfully"));
});

export {
    publishACard,
    getCardById,
    updateCard,
    deleteCard,
    getFollowedVideos,
    getAllCards,
    getUserCards,
};