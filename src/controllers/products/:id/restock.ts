import { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { InferType } from 'yup';

import { increaseStock, IncreaseStockCommand, increaseStockCommand } from 'commands/products';

import { Params } from './types';
import { isProductNotFoundError } from '../errors';

export const bodySchema = increaseStockCommand.pick(['amount']);
export type RequestBody = InferType<typeof bodySchema>;

const handler: RequestHandler = expressAsyncHandler(async (req, res) => {
	const { id } = req.parsed.params as Params;
	const { amount } = req.parsed.body as RequestBody;

	const command: IncreaseStockCommand = { id, amount };

	await increaseStock(command).catch((err) => {
		if (isProductNotFoundError(err)) err.meta.recordId = id;
		throw err;
	});

	res.end();
});

export default handler;
