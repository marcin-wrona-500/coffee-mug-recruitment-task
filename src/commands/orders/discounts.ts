import { getOrderQuantity } from './utils';

import { Discount } from './types';

const discounts = [
	{
		percent: 10,
		isApplicable: ({ order }) => getOrderQuantity(order).gt(5),
	},
	{
		percent: 20,
		isApplicable: ({ order }) => getOrderQuantity(order).gt(10),
	},
	{
		percent: 30,
		isApplicable: ({ order }) => getOrderQuantity(order).gt(50),
	},
] as const satisfies Array<Discount>;

export default discounts;
