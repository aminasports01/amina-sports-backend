import { Router } from 'express';
import { UserRoute } from '../modules/user/user.route';
import { ProductRoutes } from '../modules/products/product.route';
import { OrderRoutes } from '../modules/orders/order.route';
import { CartRoute } from '../modules/cart/cart.route';
import { ChatbotRoutes } from '../modules/chatbot/chatbot.route';
import { WishlistRoutes } from '../modules/wishlist/wishlist.route';
import { categoryRoutes } from '../modules/category/category.route';
import { HeroRoutes } from '../modules/hero-management/hero.route';
import { PersonalEntryRoutes } from '../modules/accounts/personal/personalEntry.route';
import { SteadfastWithdrawalRoutes } from '../modules/accounts/steadfast-withdrawal/steadfast-withdrawal.route';
import { InvestorPaymentRoutes } from '../modules/accounts/investor-payment/investor-payment.route';
import { ShipmentRoutes } from '../modules/accounts/shipment/shipment.route';
import { WholesaleRoutes } from '../modules/accounts/wholesale/wholesale.route';
import { MonthlyCostRoutes } from '../modules/accounts/monthly-cost/monthly-cost.route';
import { AnalyticsRoutes } from '../modules/analytics/analytics.route';
import { DashboardRoutes } from '../modules/dashboard-analytics/dashboard.route';
import { ReviewRoutes } from '../modules/reviews/review.route';

const router = Router();

router.use('/users', UserRoute);
router.use('/products', ProductRoutes);
router.use('/orders', OrderRoutes);
router.use('/cart', CartRoute);
router.use('/chatbot', ChatbotRoutes);
router.use('/wishlist', WishlistRoutes);
router.use('/categories', categoryRoutes);
router.use('/heroes', HeroRoutes);
router.use('/analytics', AnalyticsRoutes);
router.use('/dashboard-analytics', DashboardRoutes);
router.use('/reviews', ReviewRoutes);

// account api
router.use('/personal-entries', PersonalEntryRoutes);
router.use('/steadfast-withdrawals', SteadfastWithdrawalRoutes);
router.use('/investor-payments', InvestorPaymentRoutes);
router.use('/shipments', ShipmentRoutes);
router.use('/wholesales', WholesaleRoutes);
router.use('/monthly-costs', MonthlyCostRoutes);

export default router;
