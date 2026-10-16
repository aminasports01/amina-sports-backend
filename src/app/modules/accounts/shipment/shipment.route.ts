import { Router } from 'express';

import { auth } from '../../../middleware/auth';
import { Role } from '../../../../generated/prisma/enums';

import { shipmentController } from './shipment.controller';

const router = Router();
const accessRole = auth(Role.ADMIN, Role.SELLER, Role.SUPER_ADMIN);

router.post('/', accessRole, shipmentController.createShipment);

router.get('/', shipmentController.getAllShipments);

router.get('/:id', shipmentController.getSingleShipment);

router.patch('/:id', accessRole, shipmentController.updateShipment);

router.delete('/:id', accessRole, shipmentController.deleteShipment);

export const ShipmentRoutes = router;
