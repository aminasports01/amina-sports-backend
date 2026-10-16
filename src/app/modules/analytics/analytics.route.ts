import { Router } from 'express';

import { analyticsController } from './analytics.controller';
import { auth } from '../../middleware/auth';
import { Role } from '../../../generated/prisma/enums';

const router = Router();
const accessRole = auth(Role.ADMIN, Role.SUPER_ADMIN);

router.get('/', accessRole, analyticsController.getAnalytics);

export const AnalyticsRoutes = router;
