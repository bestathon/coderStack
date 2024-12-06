import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    card: {
        type: Schema.Types.ObjectId,
        ref: "Card"
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
},
    {
        timestamps: true,
    }
)

export const Like = mongoose.model("Like", likeSchema);