import express from 'express';

import { errorHandler as validationErrorHandler } from 'middleware/yupValidator';
import { endpointNotFoundHandler, serverErrorHandler } from 'middleware/errors';

import productsRoute from './products';
import ordersRoute from './orders';

const router = express.Router();

router.use(express.json());

router.use('/products', productsRoute);
router.use('/orders', ordersRoute);

router.use(validationErrorHandler, serverErrorHandler, endpointNotFoundHandler);

export default router;
