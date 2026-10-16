import { Router } from 'express';

import { HeroController } from './hero.controller';
import { auth } from '../../middleware/auth';
import { Role } from '../../../generated/prisma/enums';

const router = Router();
const accessRole = auth(Role.ADMIN, Role.SUPER_ADMIN);

router.post('/', accessRole, HeroController.createHero);

router.get('/', accessRole, HeroController.getAllHeroes);

router.get('/:id', accessRole, HeroController.getHeroById);

router.patch('/:id', accessRole, HeroController.updateHero);

router.delete('/:id', accessRole, HeroController.deleteHero);

export const HeroRoutes = router;
