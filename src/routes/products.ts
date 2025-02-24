import { Router } from 'express';
import validator from 'middleware/yupValidator';

import { createProductCommand } from 'commands/products';

import getProducts from 'controllers/products/get';
import postProducts from 'controllers/products/post';

import restockProduct from 'controllers/products/:id/restock';
import { bodySchema as restockBodySchema } from 'controllers/products/:id/restock';

import sellProduct, { understockErrorHandler } from 'controllers/products/:id/sell';
import { bodySchema as sellBodySchema } from 'controllers/products/:id/sell';

import { productNotFoundErrorHandler } from 'controllers/products/errors';

import { paramsSchema } from 'controllers/products/:id/types';

const router = Router();

router.get('', getProducts);
router.post('', validator({ body: createProductCommand }), postProducts);
router.post(
	'/:id/restock',
	validator({ body: restockBodySchema, params: paramsSchema }),
	restockProduct,
	productNotFoundErrorHandler
);
router.post(
	'/:id/sell',
	validator({ body: sellBodySchema, params: paramsSchema }),
	sellProduct,
	productNotFoundErrorHandler,
	understockErrorHandler
);

export default router;
