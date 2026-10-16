import express from 'express';

import { PersonalEntryController } from './personalEntry.controller';
import { auth } from '../../../middleware/auth';
import { Role } from '../../../../generated/prisma/enums';

const router = express.Router();
const accessRole = auth(Role.ADMIN, Role.SUPER_ADMIN);

router.post('/', auth(Role.ADMIN), PersonalEntryController.createPersonalEntry);

router.get('/', accessRole, PersonalEntryController.getAllPersonalEntries);

router.get('/:id', accessRole, PersonalEntryController.getSinglePersonalEntry);

router.patch('/:id', accessRole, PersonalEntryController.updatePersonalEntry);

router.delete('/:id', accessRole, PersonalEntryController.deletePersonalEntry);

export const PersonalEntryRoutes = router;
