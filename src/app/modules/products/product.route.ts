// product.route.ts
import { Router } from 'express';
import { ProductController } from './product.controller';
import { auth } from '../../middleware/auth';
import { Role } from '../../../generated/prisma/enums';

const router = Router();

const accessRole = auth(Role.ADMIN, Role.SELLER, Role.SUPER_ADMIN);

router.post('/', accessRole, ProductController.createProduct);
router.get('/', ProductController.getAllProducts);
router.get('/:slug', ProductController.getSingleProduct);
router.patch('/:id', accessRole, ProductController.updateProduct);
router.delete('/:id', accessRole, ProductController.deleteProduct);

export const ProductRoutes = router;
