import { Schema } from "mongoose";

const OrderSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: [String],
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: '주문완료',
        },
        qty: {
            type: Number,
        },
        // password: {
        //     type: String,
        // },
        products: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: 'products',
                },
                qty: {
                    type: Number,
                    required: true,
                },
            },
        ],
    },
    {
        collection: 'orders',
        timestamps: true,
    }
);

export { OrderSchema };