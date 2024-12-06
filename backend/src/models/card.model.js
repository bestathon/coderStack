import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const cardSchema = new Schema(
    {
        file: {
            type: String, 
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        views: {
            type: Number,
            default: 0,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

cardSchema.plugin(mongooseAggregatePaginate);

export const Card = mongoose.model("Card", cardSchema);