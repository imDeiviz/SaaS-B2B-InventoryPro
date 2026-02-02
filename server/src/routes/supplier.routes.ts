import { Router } from 'express';
import * as supplierController from '../controllers/supplier.controller.js';

const router = Router();

router.get('/', supplierController.getSuppliers);
router.post('/', supplierController.createSupplier);

export default router;
