import { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';

import { CreateProductCommand } from 'commands/products';
import { createProduct } from 'commands/products/handlers';

const handler: RequestHandler = expressAsyncHandler(async (req, res) => {
	const command = req.parsed.body as CreateProductCommand;

	await createProduct(command);

	res.end();
});

export default handler;
