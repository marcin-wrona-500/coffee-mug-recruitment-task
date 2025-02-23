import { afterAll, beforeAll, expect, test } from '@jest/globals';
import { Customer } from '@prisma/client';
import {
	createOrder,
	CreateOrderCommand,
	getDiscount,
	GetDiscountCommand,
	getPriceFactor,
} from 'commands/orders';

import { createProduct, decreaseStock, increaseStock } from 'commands/products';
import prisma from 'utils/prisma';

let customer: Customer;

beforeAll(() =>
	prisma.customer.create({ data: { name: 'Test Customer', country: 'PL' } }).then((dbData) => {
		customer = dbData;
	})
);

afterAll(async () => {
	const { orderIds, productIds } = await prisma.order
		.findMany({
			select: {
				id: true,
				OrderItem: {
					select: {
						id: true,
						Product: {
							select: {
								id: true,
							},
						},
					},
				},
			},
			where: { id_Customer: { equals: customer.id } },
		})
		.then((orders) => ({
			orderIds: orders.map(({ id }) => id),
			productIds: orders.flatMap(({ OrderItem: items }) =>
				items.map(({ Product: { id } }) => id)
			),
		}));

	await prisma.orderItem.deleteMany({ where: { id_Order: { in: orderIds } } });
	await prisma.product.deleteMany({ where: { id: { in: productIds } } });
	await prisma.order.deleteMany({ where: { id: { in: orderIds } } });
	await prisma.customer.delete({ where: { id: customer.id } });
});

test('Integration test - scenario 1', async () => {
	const productId = await createProduct({
		name: 'Test Product',
		description: 'Test Product for integration tests',
		price: 12.34,
		stock: 5,
	}).then(({ id }) => id);
	expect(productId).toBeDefined();

	await expect(
		increaseStock({
			id: productId,
			amount: 30,
		})
	).resolves.toBeDefined();

	await expect(
		decreaseStock({
			id: productId,
			amount: 100,
		})
	).rejects.toThrow();

	await expect(
		decreaseStock({
			id: productId,
			amount: 10,
		})
	).resolves.toBeDefined();

	await expect(
		(() => {
			const partialOrder: GetDiscountCommand['order'] = {
				customerId: customer.id,
				products: [{ id: productId, quantity: 100, unitPrice: 12.34 }],
			};

			const discount = getDiscount({ order: partialOrder });
			const priceFactor = getPriceFactor({ country: customer.country });

			const order: CreateOrderCommand = {
				...partialOrder,
				priceFactor,
				discount,
			};

			return createOrder(order);
		})()
	).rejects.toThrow();

	await expect(
		(() => {
			const partialOrder: GetDiscountCommand['order'] = {
				customerId: customer.id,
				products: [{ id: productId, quantity: 10, unitPrice: 12.34 }],
			};

			const discount = getDiscount({ order: partialOrder });
			const priceFactor = getPriceFactor({ country: customer.country });

			const order: CreateOrderCommand = {
				...partialOrder,
				priceFactor,
				discount,
			};

			return createOrder(order);
		})()
	).resolves.toBeDefined();
});
