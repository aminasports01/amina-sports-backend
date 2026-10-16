import { Router } from 'express';
import {
  deleteOrderController,
  OrderController,
  updateOrderStatusController,
} from './order.controller';
import { Role } from '../../../generated/prisma/enums';
import { auth } from '../../middleware/auth';

const router = Router();

const accessRole = auth(Role.ADMIN, Role.SUPER_ADMIN);

//  BUY NOW (single product)

router.post(
  '/buy-now',

  OrderController.buyNow,
);

//  CART CHECKOUT

router.post(
  '/checkout',

  OrderController.checkoutCart,
);

// get all orders( admin only)
router.get('/all', accessRole, OrderController.getAllOrders);

// get customer order history
router.get('/customer-history', OrderController.getCustomerOrderHistoryByPhone);

// get single order
router.get('/:orderId', OrderController.getSingleOrder);

// GET USER ORDERS

router.get(
  '/',
  auth(Role.CUSTOMER, Role.ADMIN, Role.SUPER_ADMIN),
  OrderController.getOrders,
);

// Update order status
router.patch('/:id/status', accessRole, updateOrderStatusController);
router.patch('/:id', OrderController.updateOrderController);

// Delete order
router.delete('/:id', accessRole, deleteOrderController);
export const OrderRoutes = router;
