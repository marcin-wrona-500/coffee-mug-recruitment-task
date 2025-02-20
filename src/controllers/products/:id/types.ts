import * as yup from 'yup';

export const paramsSchema = yup
	.object({
		id: yup.number().required().integer().positive(),
	})
	.required()
	.exact();
export type Params = yup.InferType<typeof paramsSchema>;
