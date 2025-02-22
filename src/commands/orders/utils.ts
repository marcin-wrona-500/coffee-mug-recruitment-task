import { Decimal } from 'decimal.js';

import { sum } from 'utils/arrays';

import { GetDiscountCommand } from './commands';

export const getOrderQuantity = (data: GetDiscountCommand['order']) =>
	data.products.flatMap(({ quantity }) => quantity).reduce(sum, new Decimal(0));
