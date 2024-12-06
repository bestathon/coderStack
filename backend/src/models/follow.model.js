import mongoose, { Schema } from "mongoose";

const followSchema = new Schema({
    follower: {
        type: Schema.Types.ObjectId,   // one who is following
        ref: "User",
    },
    following: {
        type: Schema.Types.ObjectId,   // one to whom 'following'
        ref: "User",
    },
}, { timestamps: true })

export const Follow = mongoose.model("Follow", followSchema)