import { orderModel } from '../db';

class OrderService {
  constructor(orderModel) {
    this.orderModel = orderModel;
  }

  async addOrder(orderInfo) {
    return await this.orderModel.create(orderInfo);
  }

  async getOrders() {
    return await this.orderModel.findAll();
  }

  async getOrdersByUserId(userId) {
    return await this.orderModel.findAllByUserId(userId);
  }

  async getOrder(orderId) {
    const order = await this.orderModel.findById(orderId).lean();

    if (!order) {
      throw new Error('등록된 주문이 없습니다. 다시 한 번 확인해 주세요.');
    }

    let totalPrice = 0;

    for (let i = 0; i < order.products.length; i++) {
      totalPrice += order.products[i].productId.price * order.products[i].qty;
    }

    return { ...order, totalPrice };
  }

  async updateOrder(orderInfoRequired, toUpdate) {
    const { orderId } = orderInfoRequired;
    let order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new Error('등록된 주문이 없습니다. 다시 한 번 확인해 주세요.');
    }

    order = await this.orderModel.update({
      orderId,
      update: toUpdate,
    });

    return order;
  }

  async removeOrder(orderId) {
    let order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new Error('등록된 주문이 없습니다. 다시 한 번 확인해 주세요.');
    }

    order = await this.orderModel.delete(orderId);

    return order;
  }
}

const orderService = new OrderService(orderModel);

export { orderService };