import { Router } from 'express';

import { wholesaleController } from './wholesale.controller';
import { auth } from '../../../middleware/auth';
import { Role } from '../../../../generated/prisma/enums';

const router = Router();
const accessRole = auth(Role.ADMIN, Role.SELLER, Role.SUPER_ADMIN);

router.post('/', accessRole, wholesaleController.createWholesale);

router.get('/', accessRole, wholesaleController.getAllWholesales);

router.get('/:id', accessRole, wholesaleController.getSingleWholesale);

router.patch('/:id', accessRole, wholesaleController.updateWholesale);

router.delete('/:id', accessRole, wholesaleController.deleteWholesale);

export const WholesaleRoutes = router;
