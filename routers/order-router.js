import { Router } from 'express';
import { adminCheck, emptyObejctCheck } from '../middlewares';
import { orderService } from '../services';

const router = Router();

router.post('/', emptyObejctCheck, async (req, res, next) => {
    try {
      const {
        name,
        userId,
        email,
        phone,
        address,
        paymentMethod,
        qty,
        password,
        products,
      } = req.body;
  
      const newOrder = await orderService.addOrder({
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
  
      res.status(201).json(newOrder);
    } catch (error) {
      next(error);
    }
});

router.get('/', async function (req, res, next) {
    try {
      const userId = req.query.userId;
      let orders;
  
      if (userId) {
        orders = await orderService.getOrdersByUserId(userId);
      } else {
        orders = await orderService.getOrders();
      }
  
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
});

router.get('/:orderId', async function (req, res, next) {
    try {
      const orderId = req.params.orderId;
      const order = await orderService.getOrder(orderId);
  
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
});

router.put('/:orderId', emptyObejctCheck, async function (req, res, next) {
    try {
      const orderId = req.params.orderId;
      const {
        name,
        phone,
        address,
        paymentMethod,
        status,
        email,
        qty,
        password,
        productIds,
      } = req.body;
      const orderInfoRequired = { orderId };
      const toUpdate = {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(address && { address }),
        ...(paymentMethod && { paymentMethod }),
        ...(status && { status }),
        ...(email && { email }),
        ...(qty && { qty }),
        ...(password && { password }),
        ...(productIds && { products: productIds }),
      };
      const updatedOrderInfo = await orderService.updateOrder(
        orderInfoRequired,
        toUpdate
      );
  
      res.status(200).json(updatedOrderInfo);
    } catch (error) {
      next(error);
    }
});

router.delete('/:orderId', adminCheck, async function (req, res, next) {
    try {
      const orderId = req.params.orderId;
      const order = await orderService.removeOrder(orderId);
  
      res.status(200).json(order);
    } catch (error) {
      next(error);
    }
});
  
export { orderRouter };