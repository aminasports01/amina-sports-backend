import { Router } from 'express';
import { SteadfastWithdrawalController } from './steadfast-withdrawal.controller';
import { auth } from '../../../middleware/auth';
import { Role } from '../../../../generated/prisma/enums';

const router = Router();
const accessRole = auth(Role.ADMIN, Role.SELLER, Role.SUPER_ADMIN);

router.post('/', accessRole, SteadfastWithdrawalController.createWithdrawal);

router.get('/', accessRole, SteadfastWithdrawalController.getAllWithdrawals);

router.get(
  '/:id',
  accessRole,
  SteadfastWithdrawalController.getSingleWithdrawal,
);

router.patch(
  '/:id',
  accessRole,
  SteadfastWithdrawalController.updateWithdrawal,
);

router.delete(
  '/:id',
  accessRole,
  SteadfastWithdrawalController.deleteWithdrawal,
);

export const SteadfastWithdrawalRoutes = router;
