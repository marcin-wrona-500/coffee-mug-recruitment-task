import { getOrderQuantity, isBlackFriday, isPolishHoliday } from './utils';

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
	{
		percent: 25,
		isApplicable: () => isBlackFriday(new Date()),
	},
	{
		percent: 15,
		isApplicable: () => isPolishHoliday(new Date()),
	},
] as const satisfies Array<Discount>;

export default discounts;
