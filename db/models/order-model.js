import { model, Types } from "mongoose";
import { OrderSchema } from "../schemas/order-schema";

const Order = model('orders', OrderSchema);

export class OrderModel {
    
    // 주문 등록
    async create({
        name,
        userId,
        email,
        phone,
        address,
        paymentMethod,
        qty,
        password,
        products,
      }) {
        const orderResult = await Order.create({
            name,
            userId,
            email,
            phone,
            address,
            paymentMethod,
            qty,
            password,
            products,
        });
        return orderResult;
    }
    
    // 주문 조회
    async findAll() {
        const orderResult = await Order.aggregate([
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'products'
                }
            }
        ]);
        return orderResult;
    }

    async findAllByUserId(userId) {
        const orderResult = await Order.aggregate([
            {
                $match: { userId }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'products'
                }
            }
        ]);
        return orderResult;
    }

    async findById(orderId) {
        const orderResult = await Order.aggregate([
            {
                $match: { _id: Types.ObjectId(orderId) }
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.productId',
                    foreignField: '_id',
                    as: 'products'
                }
            },
            {
                $project: { __v: 0 }
            }
        ]);
        return orderResult[0]; // 결과는 배열로 반환되므로 첫 번째 항목을 반환
    }

    // 주문 수정
    async update({ orderId, update }) {
        const filter = { _id: orderId };
        const updateResult = await Order.updateOne(filter, update);
    
        if (updateResult.nModified === 0) {
            // 업데이트된 카테고리 수정이 없는 경우 nModified
            throw new Error('업데이트할 주문 정보를 찾을 수 없습니다.');
        }

        return updateResult;
    }

    // 주문 삭제
    async delete(orderId) {
        return await Order.deleteOne({ _id: orderId });
    }
}

const orderModel = new OrderModel();

export { orderModel };