import { ErrorRequestHandler, RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { InferType } from 'yup';

import { Prisma } from '@prisma/client';

import { decreaseStock, DecreaseStockCommand, decreaseStockCommand } from 'commands/products';

import { Params } from './types';

export const bodySchema = decreaseStockCommand.pick(['amount']);
export type RequestBody = InferType<typeof bodySchema>;

const handler: RequestHandler = expressAsyncHandler(async (req, res) => {
	const { id } = req.parsed.params as Params;
	const { amount } = req.parsed.body as RequestBody;

	const command: DecreaseStockCommand = { id, amount };

	await decreaseStock(command);

	res.end();
});

export const understockErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
	const isUnderstockError =
		err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2020';
	if (!isUnderstockError) return next(err);

	res.status(400).json({ error: 'Not enough stock to sell the requested amount' });
};

export default handler;
