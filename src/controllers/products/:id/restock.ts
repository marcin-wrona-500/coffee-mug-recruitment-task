import { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { InferType } from 'yup';

import { increaseStock, IncreaseStockCommand, increaseStockCommand } from 'commands/products';

import { Params } from './types';

export const bodySchema = increaseStockCommand.pick(['amount']);
export type RequestBody = InferType<typeof bodySchema>;

const handler: RequestHandler = expressAsyncHandler(async (req, res) => {
	const { id } = req.parsed.params as Params;
	const { amount } = req.parsed.body as RequestBody;

	const command: IncreaseStockCommand = { id, amount };

	await increaseStock(command);

	res.end();
});

export default handler;
