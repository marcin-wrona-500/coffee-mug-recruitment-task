import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { Decimal } from 'decimal.js';

import { increaseStock, IncreaseStockCommand } from 'commands/products';
import prisma from 'utils/prisma';

import { Product } from '@prisma/client';

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

describe('IncreaseStock command', () => {
	test('increase product stock', async () => {
		const oldStock = product.stock;
		const increaseBy = 5;
		const expected = new Decimal(oldStock).plus(increaseBy).toNumber();

		const command: IncreaseStockCommand = {
			id: product.id,
			amount: increaseBy,
		};

		await increaseStock(command);

		const { stock: updatedStock } = await prisma.product.findUniqueOrThrow({
			select: { stock: true },
			where: { id: product.id },
		});

		expect(updatedStock.toNumber()).toBe(expected);
	});
});
