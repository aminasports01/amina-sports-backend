import { Router } from 'express';
import { UserController } from './user.controller';
import { auth } from '../../middleware/auth';
import { Role } from '../../../generated/prisma/enums';

const router = Router();
const accessRole = auth(
  Role.ADMIN,
  Role.SELLER,
  Role.CUSTOMER,
  Role.SUPER_ADMIN,
);

router.post('/', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get('/', accessRole, UserController.getAllUsers);
router.get('/me', accessRole, UserController.getCurrentUser); // Current user

router.get('/:id', accessRole, UserController.getSingleUser); // Single user
router.put('/:id', accessRole, UserController.updateUser); // Update user
router.put('/:id/password', accessRole, UserController.changePassword);
router.delete('/:id', accessRole, UserController.deleteUser);

export const UserRoute = router;
