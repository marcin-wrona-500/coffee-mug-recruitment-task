import { afterAll, beforeAll, beforeEach, expect, test } from '@jest/globals';
import { Decimal } from 'decimal.js';

import { decreaseStock, DecreaseStockCommand } from 'commands/products';
import prisma from 'utils/prisma';

import { Product } from '@prisma/client';
import { describe } from 'node:test';

let product: Product;

beforeAll(() =>
	prisma.product
		.create({
			data: {
				name: 'Test product',
				description: 'A test product used in unit tests',
				price: 1,
				stock: 20,
			},
		})
		.then((dbData) => {
			product = dbData;
		})
);

afterAll(() => prisma.product.delete({ where: { id: product.id } }));

// keep the stock level the same for every test
beforeEach(() => prisma.product.update({ data: { stock: 20 }, where: { id: product.id } }));

describe('DecreaseStock command', () => {
	test('decrease when enough stock', async () => {
		const oldStock = product.stock;
		const decreaseBy = 5;
		const expected = new Decimal(oldStock).minus(decreaseBy).toNumber();

		const command: DecreaseStockCommand = {
			id: product.id,
			amount: decreaseBy,
		};

		await decreaseStock(command);

		const { stock: updatedStock } = await prisma.product.findUniqueOrThrow({
			select: { stock: true },
			where: { id: product.id },
		});

		expect(updatedStock.toNumber()).toBe(expected);
	});

	test('decrease when not enough stock', async () => {
		const decreaseBy = product.stock.add(1).toNumber();

		const command: DecreaseStockCommand = {
			id: product.id,
			amount: decreaseBy,
		};

		expect(decreaseStock(command)).rejects.toThrow();
	});
});
