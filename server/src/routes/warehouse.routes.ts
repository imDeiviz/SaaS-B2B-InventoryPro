import { Router } from 'express';
import * as warehouseController from '../controllers/warehouse.controller.js';

const router = Router();

router.get('/', warehouseController.getWarehouses);
router.post('/', warehouseController.createWarehouse);

export default router;
