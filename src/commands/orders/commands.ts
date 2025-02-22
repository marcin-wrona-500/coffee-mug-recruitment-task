import * as yup from 'yup';

import { Alpha2 } from '@prisma/client';

export const createOrderCommand = yup
	.object({
		customerId: yup.number().required().integer().positive(),
		products: yup
			.array()
			.required()
			.min(1)
			.of(
				yup
					.object({
						id: yup.number().required().integer().positive(),
						unitPrice: yup.number().required().integer().positive(),
						quantity: yup.number().required().integer().positive(),
					})
					.required()
					.exact()
			),
		priceFactor: yup.number().required().integer().positive(),
		discount: yup.number().notRequired().nonNullable().integer().positive(),
	})
	.required()
	.exact();
export type CreateOrderCommand = yup.InferType<typeof createOrderCommand>;

export const getDiscountCommand = yup
	.object({
		order: createOrderCommand.omit(['discount', 'priceFactor']),
	})
	.required()
	.exact();
export type GetDiscountCommand = yup.InferType<typeof getDiscountCommand>;

export const getPriceFactorCommand = yup
	.object({
		country: yup.string().required().oneOf(Object.values(Alpha2)),
	})
	.required()
	.exact();
export type GetPriceFactorCommand = yup.InferType<typeof getPriceFactorCommand>;
