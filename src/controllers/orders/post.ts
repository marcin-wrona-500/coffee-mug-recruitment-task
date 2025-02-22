import { ErrorRequestHandler, RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';

import { CreateOrderCommand, GetDiscountCommand, createOrder, getDiscount } from 'commands/orders';
import prisma from 'utils/prisma';

import { OrdersPostBodySchema } from './types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const handler: RequestHandler = expressAsyncHandler(async (req, res) => {
	const body = req.parsed.body as OrdersPostBodySchema;

	const productData = await Promise.all(
		body.products.map<Promise<CreateOrderCommand['products'][number]>>(({ id, ...rest }) =>
			prisma.product
				.findUniqueOrThrow({
					select: { price: true },
					where: { id },
				})
				.catch((err) => {
					if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
						if (!err.meta) err.meta = {};
						err.meta.recordId = id;
					}
					throw err;
				})
				.then(({ price }) => ({
					id,
					...rest,
					unitPrice: price.toNumber(),
				}))
		)
	);

	const command: CreateOrderCommand = {
		...body,
		products: productData,
	};

	const getDiscountCommand: GetDiscountCommand = { order: command };
	command.discount = getDiscount(getDiscountCommand);

	await createOrder(command);

	res.end();
});

export const productNotFoundErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
	if (!(err instanceof PrismaClientKnownRequestError && err.code === 'P2025')) return next(err);

	const productId = err.meta?.recordId as number | undefined;

	res.status(400).json({
		error: 'A product with the specified ID does not exist',
		...(productId ? { productId } : undefined),
	});
};

export default handler;
