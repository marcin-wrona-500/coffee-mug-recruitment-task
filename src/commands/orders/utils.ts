import { Decimal } from 'decimal.js';
import Holidays from 'date-holidays';

import { sum } from 'utils/arrays';
import { areDatesEqual } from 'utils/dates';

import { GetDiscountCommand } from './commands';

const polishHolidays = new Holidays('PL');
const americanHolidays = new Holidays('US');

export const getOrderQuantity = (data: GetDiscountCommand['order']) =>
	data.products.flatMap(({ quantity }) => quantity).reduce(sum, new Decimal(0));

export const isBlackFriday = (date: Date) => {
	const blackFriday = americanHolidays
		.getHolidays(date.getFullYear())
		.find(({ rule }) => rule === 'friday after 4th thursday in November');

	return Boolean(blackFriday && areDatesEqual(date, new Date(blackFriday.date)));
};

export const isPolishHoliday = (date: Date) => {
	const bankHolidays = polishHolidays
		.getHolidays(date.getFullYear())
		// in Poland, "bank" holidays are called "public", and the library reflects that
		.filter(({ type }) => type === 'public');

	return bankHolidays.some(({ date: holidayDate }) => areDatesEqual(date, new Date(holidayDate)));
};
