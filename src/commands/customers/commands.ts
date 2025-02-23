import * as yup from 'yup';

import { databaseId } from 'utils/yup';

export const getCustomerCommand = yup
	.object({
		id: databaseId.required(),
	})
	.required()
	.exact();
export type GetCustomerCommand = yup.InferType<typeof getCustomerCommand>;
