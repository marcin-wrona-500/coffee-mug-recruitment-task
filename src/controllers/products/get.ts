import { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';

import { GetProductsCommand } from 'commands/products';
import { getProducts } from 'commands/products/handlers';

const handler: RequestHandler = expressAsyncHandler(async (_req, res) => {
	const command: GetProductsCommand = undefined;

	const ret = await getProducts(command);

	res.json(ret);
});

export default handler;
