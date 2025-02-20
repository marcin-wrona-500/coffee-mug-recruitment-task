import { Router } from 'express';
import validator from 'middleware/yupValidator';

import { createProductCommand } from 'commands/products';

import getProducts from 'controllers/products/get';
import postProducts from 'controllers/products/post';

const router = Router();

router.get('', getProducts);
router.post('', validator({ body: createProductCommand }), postProducts);

export default router;
