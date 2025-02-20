import { Router } from 'express';
import validator from 'middleware/yupValidator';

import { createProductCommand } from 'commands/products';

import getProducts from 'controllers/products/get';
import postProducts from 'controllers/products/post';

import restockProduct from 'controllers/products/:id/restock';
import { bodySchema as restockBodySchema } from 'controllers/products/:id/restock';

import { paramsSchema } from 'controllers/products/:id/types';

const router = Router();

router.get('', getProducts);
router.post('', validator({ body: createProductCommand }), postProducts);
router.post(
	'/:id/restock',
	validator({ body: restockBodySchema, params: paramsSchema }),
	restockProduct
);

export default router;
