import { ErrorRequestHandler } from 'express';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import { ProductNotFoundError } from './types';

export const isProductNotFoundError = (err: Error): err is ProductNotFoundError =>
	err instanceof PrismaClientKnownRequestError &&
	err.code === 'P2025' &&
	err.meta?.modelName === 'Product';

export const productNotFoundErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
	if (!isProductNotFoundError(err)) return next(err);

	const { recordId: productId } = err.meta;

	res.status(400).json({
		error: 'A product with the specified ID does not exist',
		...(productId ? { productId } : undefined),
	});
};
