import { Router } from 'express';

import { ReviewController } from './review.controller';
import { auth } from '../../middleware/auth';
import { Role } from '../../../generated/prisma/enums';

const router = Router();
const accessRole = auth(Role.ADMIN, Role.SUPER_ADMIN);

router.post('/', ReviewController.createReview);

router.get(
  '/product/:productId',
  accessRole,
  ReviewController.getProductReviews,
);

router.get('/:id', accessRole, ReviewController.getSingleReview);

router.patch('/:id', accessRole, ReviewController.updateReview);

router.delete('/:id', accessRole, ReviewController.deleteReview);

export const ReviewRoutes = router;
