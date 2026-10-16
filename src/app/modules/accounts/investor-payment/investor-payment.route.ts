import { Router } from 'express';

import { investorPaymentController } from './investor-payment.controller';
import { Role } from '../../../../generated/prisma/enums';
import { auth } from '../../../middleware/auth';

const router = Router();
const accessRole = auth(Role.ADMIN, Role.SELLER, Role.SUPER_ADMIN);

router.post('/', accessRole, investorPaymentController.createInvestorPayment);

router.get('/', accessRole, investorPaymentController.getAllInvestorPayments);

router.get(
  '/:id',
  accessRole,
  investorPaymentController.getSingleInvestorPayment,
);

router.patch(
  '/:id',
  accessRole,
  investorPaymentController.updateInvestorPayment,
);

router.delete(
  '/:id',
  accessRole,
  investorPaymentController.deleteInvestorPayment,
);

export const InvestorPaymentRoutes = router;
