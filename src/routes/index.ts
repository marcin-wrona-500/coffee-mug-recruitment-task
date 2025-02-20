import express from 'express';

import { errorHandler } from 'middleware/yupValidator';

import productsRoute from './products';
import ordersRoute from './orders';

const router = express.Router();

router.use(express.json());

router.use('/products', productsRoute);
router.use('/orders', ordersRoute);

router.use(errorHandler);

export default router;
