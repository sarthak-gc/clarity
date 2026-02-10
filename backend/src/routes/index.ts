import { Router } from 'express';
import authRoutes from './auth.routes'
import transactionRoutes from './transaction.routes'
import categoriesRoutes from './category.routes'
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.use('/auth', authRoutes)
router.use(authMiddleware)
router.use('/transactions', transactionRoutes)
router.use('/categories', categoriesRoutes)

export default router
