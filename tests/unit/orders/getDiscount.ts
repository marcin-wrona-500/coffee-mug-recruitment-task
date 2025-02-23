import { describe, expect, test, jest, beforeEach } from '@jest/globals';

import { getDiscount, GetDiscountCommand } from 'commands/orders';

const testOrderWithQantity = (quantity: number): GetDiscountCommand => ({
	order: {
		customerId: 1,
		products: [{ id: 1, quantity, unitPrice: 1 }],
	},
});

const exampleRegularDate = '2025-02-23';

const exampleBlackFriday = '2025-11-28';

const examplePolishBankHolidays = [
	'2025-01-01',
	'2025-01-06',
	'2025-04-20',
	'2025-04-21',
	'2025-05-01',
	'2025-05-03',
	'2025-06-08',
	'2025-06-19',
	'2025-08-15',
	'2025-11-01',
	'2025-11-11',
	'2025-12-24',
	'2025-12-25',
	'2025-12-26',
];

const smallOrders = [1, 5].map((quantity) => testOrderWithQantity(quantity));
const smallBulkOrders = [6, 10].map((quantity) => testOrderWithQantity(quantity));
const mediumBulkOrders = [11, 50].map((quantity) => testOrderWithQantity(quantity));
const largeBulkOrders = [51, 1000].map((quantity) => testOrderWithQantity(quantity));

describe('discounts on a regular day', () => {
	beforeEach(() => {
		jest.useFakeTimers().setSystemTime(new Date(exampleRegularDate));
	});

	test('discount value for small orders', () => {
		smallOrders.forEach((order) => expect(getDiscount(order)).toBeUndefined());
	});

	test('discount value for small bulk orders', () => {
		smallBulkOrders.forEach((order) => expect(getDiscount(order)).toBe(10));
	});

	test('discount value for medium bulk orders', () => {
		mediumBulkOrders.forEach((order) => expect(getDiscount(order)).toBe(20));
	});

	test('discount value for large bulk orders', () => {
		largeBulkOrders.forEach((order) => expect(getDiscount(order)).toBe(30));
	});
});

describe('discounts on Black Friday', () => {
	beforeEach(() => {
		jest.useFakeTimers().setSystemTime(new Date(exampleBlackFriday));
	});

	test('discount value for small orders', () => {
		smallOrders.forEach((order) => expect(getDiscount(order)).toBe(25));
	});

	test('discount value for small bulk orders', () => {
		smallBulkOrders.forEach((order) => expect(getDiscount(order)).toBe(25));
	});

	test('discount value for medium bulk orders', () => {
		mediumBulkOrders.forEach((order) => expect(getDiscount(order)).toBe(25));
	});

	test('discount value for large bulk orders', () => {
		largeBulkOrders.forEach((order) => expect(getDiscount(order)).toBe(30));
	});
});

describe('discounts on Polish bank holidays', () => {
	examplePolishBankHolidays.forEach((date) => {
		describe(`discount on ${date}`, () => {
			beforeEach(() => {
				jest.useFakeTimers().setSystemTime(new Date(date));
			});

			test('discount value for small orders', () => {
				smallOrders.forEach((order) => expect(getDiscount(order)).toBe(15));
			});

			test('discount value for small bulk orders', () => {
				smallBulkOrders.forEach((order) => expect(getDiscount(order)).toBe(15));
			});

			test('discount value for medium bulk orders', () => {
				mediumBulkOrders.forEach((order) => expect(getDiscount(order)).toBe(20));
			});

			test('discount value for large bulk orders', () => {
				largeBulkOrders.forEach((order) => expect(getDiscount(order)).toBe(30));
			});
		});
	});
});
