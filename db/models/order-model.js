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
        try {
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
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('주문 등록 중 오류 발생');
        }
    }
    
    // 주문 조회
    async findAll() {
        try {
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
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('주문 조회 중 오류 발생');
        }
    }

    async findAllByUserId(userId) {
        try {
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
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('주문 조회 중 오류 발생');
        }
    }

    async findById(orderId) {
        try {
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
                }
            ]);
            return orderResult[0]; // 결과는 배열로 반환되므로 첫 번째 항목을 반환
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('주문 조회 중 오류 발생');
        }
    }

    // 주문 수정
    async update({ orderId, update }) {
        const filter = { _id: orderId };
        const updateResult = await Order.updateOne(filter, update);
    
        if (updateResult.nModified === 0) {
            // 업데이트된 카테고리 수정이 없는 경우 nModified
            throw new Error('업데이트할 주문 정보를 찾을 수 없습니다.');
        }

        return { message: '주문 정보 업데이트 완료' };
    }

    // 주문 삭제
    async delete(orderId) {
        try {
            const orderResult = await Order.deleteOne({ _id: orderId });
            const message = orderResult.deletedCount > 0 ? '주문 삭제 완료' : '삭제할 주문이 없습니다.';
            return { message };
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('주문 삭제 중 오류 발생');
        }
    }
}

const orderModel = new OrderModel();

export { orderModel };