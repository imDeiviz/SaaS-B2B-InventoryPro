import { Router } from 'express';
import * as movementController from '../controllers/movement.controller.js';

const router = Router();

router.get('/', movementController.getMovements);
router.post('/', movementController.createMovement);

export default router;
