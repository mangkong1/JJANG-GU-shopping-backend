import { model } from "mongoose";
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
            const orderResult = await Order.find({}).populate('products.productId');
            return orderResult;
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('주문 조회 중 오류 발생');
        }
    }

    async findAllByUserId(userId) {
        try {
            const orderResult = await Order.find({ userId }).populate('products.productId');
            return orderResult;
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('주문 조회 중 오류 발생');
        }
    }

    async findById(orderId) {
        try {
            const orderResult = await Order.findOne({ _id: orderId }).populate('products.productId');
            return orderResult;
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('주문 조회 중 오류 발생');
        }
    }

    // 주문 수정

    // 주문 삭제
    async delete(orderId) {
        try {
            const orderResult = await Order.deleteOne({ _id: orderId });
            
            if (orderResult.deletedCount > 0) {
                return { message: '주문 삭제 완료' };
            } else {
                return { message: '삭제할 주문이 없습니다.'};
            }
        } catch (error) {
            // 오류 처리 코드 추가
            throw new Error('주문 삭제 중 오류 발생');
        }
    }
}

const orderModel = new OrderModel();

export { orderModel };