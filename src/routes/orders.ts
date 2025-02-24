import { Router } from 'express';

import validator from 'middleware/yupValidator';

import { postOrder, ordersPostBodySchema } from 'controllers/orders';
import { productNotFoundErrorHandler } from 'controllers/products/errors';

const router = Router();

router.post('', validator({ body: ordersPostBodySchema }), postOrder, productNotFoundErrorHandler);

export default router;
