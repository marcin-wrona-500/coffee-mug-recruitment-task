import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ErrorRequestHandler } from 'express';

export const productNotFoundErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
	if (
		!(
			err instanceof PrismaClientKnownRequestError &&
			err.code === 'P2025' &&
			err.meta?.modelName === 'Product'
		)
	)
		return next(err);

	const productId = err.meta?.recordId as number | undefined;

	res.status(400).json({
		error: 'A product with the specified ID does not exist',
		...(productId ? { productId } : undefined),
	});
};
