import { Router } from 'express';

import getProducts from 'controllers/products/get';

const router = Router();

router.get('', getProducts);

export default router;
