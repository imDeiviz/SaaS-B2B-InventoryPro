import { Router } from 'express';
import authRoutes from './auth.routes.js';
import productRoutes from './product.routes.js';
import settingsRoutes from './settings.routes.js';
import warehouseRoutes from './warehouse.routes.js';
import supplierRoutes from './supplier.routes.js';
import movementRoutes from './movement.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/settings', settingsRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/suppliers', supplierRoutes);
router.use('/movements', movementRoutes);

export default router;
