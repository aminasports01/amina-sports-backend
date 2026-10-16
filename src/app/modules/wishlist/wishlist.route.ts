import express from 'express';
import { WishlistController } from './wishlist.controller';
import { auth } from '../../middleware/auth';
import { Role } from '../../../generated/prisma/enums';

const router = express.Router();
const accessRole = auth(
  Role.ADMIN,
  Role.SELLER,
  Role.CUSTOMER,
  Role.SUPER_ADMIN,
);

/**
 * All routes require auth
 */
router.post('/', accessRole, WishlistController.createWishlist);

router.get('/', accessRole, WishlistController.getWishlistByUser);

router.delete('/:id', accessRole, WishlistController.deleteWishlistItem);

export const WishlistRoutes = router;
