import * as yup from 'yup';

export const getCustomerCommand = yup
	.object({
		id: yup.number().required().integer().positive(),
	})
	.required()
	.exact();
export type GetCustomerCommand = yup.InferType<typeof getCustomerCommand>;
