import { Schema } from "mongoose";

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            default: 0,
        },
        stock: {
            type: Number,
            required: true,
            default: 0,
        },
        description: {
            type: String,
        },
        images: {
            type: [String],
        },
        category: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'categories'
        },
    },
    {
        collection: 'products',
        timestamps: true,
    }
);

export { ProductSchema };