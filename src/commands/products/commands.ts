import * as yup from 'yup';

export const getProductsCommand = yup.mixed().oneOf([undefined]);
export type GetProductsCommand = yup.InferType<typeof getProductsCommand>;

export const getProductCommand = yup
	.object({
		id: yup.number().required().integer().positive(),
	})
	.required()
	.exact();
export type GetProductCommand = yup.InferType<typeof getProductCommand>;

export const createProductCommand = yup
	.object({
		name: yup.string().required().max(50),
		description: yup.string().required().max(50),
		price: yup.number().required().positive(),
		stock: yup.number().required().min(0),
	})
	.required()
	.exact();
export type CreateProductCommand = yup.InferType<typeof createProductCommand>;

export const increaseStockCommand = yup
	.object({
		id: yup.number().required().integer().positive(),
		amount: yup.number().required().integer().positive(),
	})
	.required()
	.exact();
export type IncreaseStockCommand = yup.InferType<typeof increaseStockCommand>;

export const decreaseStockCommand = yup
	.object({
		id: yup.number().required().integer().positive(),
		amount: yup.number().required().integer().positive(),
	})
	.required()
	.exact();
export type DecreaseStockCommand = yup.InferType<typeof decreaseStockCommand>;
