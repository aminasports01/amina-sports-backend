import { Router } from 'express';
import { MonthlyCostController } from './monthly-cost.controller';
import { auth } from '../../../middleware/auth';
import { Role } from '../../../../generated/prisma/enums';

const router = Router();
const accessRole = auth(Role.ADMIN, Role.SELLER, Role.SUPER_ADMIN);

router.post('/', accessRole, MonthlyCostController.createMonthlyCost);

router.get('/', accessRole, MonthlyCostController.getAllMonthlyCosts);

router.get('/:id', accessRole, MonthlyCostController.getSingleMonthlyCost);

router.patch('/:id', accessRole, MonthlyCostController.updateMonthlyCost);

router.delete('/:id', accessRole, MonthlyCostController.deleteMonthlyCost);

export const MonthlyCostRoutes = router;
