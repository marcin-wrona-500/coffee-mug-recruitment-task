import { GetDiscountCommand } from './commands';

export type Discount = {
	percent: number;
	isApplicable: (order: GetDiscountCommand) => boolean;
};
