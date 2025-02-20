import { Router } from 'express';

import validator from 'middleware/yupValidator';

import { postOrder, productNotFoundErrorHandler, ordersPostBodySchema } from 'controllers/orders';

const router = Router();

router.post('', validator({ body: ordersPostBodySchema }), postOrder, productNotFoundErrorHandler);

export default router;
