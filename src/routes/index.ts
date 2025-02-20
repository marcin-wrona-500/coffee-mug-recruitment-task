import express from 'express';

import { errorHandler } from 'middleware/yupValidator';

import productsRoute from './products';

const router = express.Router();

router.use('/products', productsRoute);

router.use(errorHandler);

export default router;
