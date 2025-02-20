import * as yup from 'yup';

export const getProductsCommand = yup.mixed().oneOf([undefined]);
export type GetProductsCommand = yup.InferType<typeof getProductsCommand>;

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
