import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import Decimal from 'decimal.js';

import { createOrder, CreateOrderCommand } from 'commands/orders';
import prisma from 'utils/prisma';
import { Customer, Product } from '@prisma/client';
import { sum } from 'utils/arrays';

const getRandomInt = (max: Decimal.Value) => Decimal.random().times(max).floor();

let testCustomer: Customer;
let testProducts: Array<Product>;
const testOrderIds: Array<number> = [];

beforeAll(() =>
	Promise.all([
		prisma.customer
			.create({
				data: { name: 'Test Customer', country: 'US' },
			})
			.then((dbData) => {
				testCustomer = dbData!;
			}),
		Promise.all(
			Array.from(Array(12), (_v, idx) =>
				prisma.product.create({
					data: {
						name: `Test product ${idx}`,
						description: `A test product used in unit tests ${idx}`,
						price: getRandomInt(12),
						stock: 999,
					},
				})
			)
		).then((dbData) => {
			testProducts = dbData;
		}),
	])
);

afterAll(async () => {
	await prisma.orderItem.deleteMany({ where: { id_Order: { in: testOrderIds } } });
	await prisma.order.deleteMany({ where: { id: { in: testOrderIds } } });
	return Promise.all([
		prisma.customer.delete({ where: { id: testCustomer.id } }),
		prisma.product.deleteMany({ where: { id: { in: testProducts.map(({ id }) => id) } } }),
	]);
});

describe('correct price and totals calculation', () => {
	test('no discount, neutral price factor', async () => {
		const quantities = [2, 4] as const;
		const products = testProducts.slice(0, 2).map((product, i) => ({
			...product,
			quantity: quantities[i],
		}));

		const order = {
			customerId: testCustomer.id,
			priceFactor: 1,
			products: products.map(({ id, price, quantity }) => ({
				id,
				unitPrice: price.toNumber(),
				quantity,
			})),
		} as const satisfies CreateOrderCommand;
		const result = await createOrder(order);
		testOrderIds.push(result.id);

		result.OrderItem.forEach(({ adjusted_price, price_factor, unit_price }) => {
			expect(price_factor.toNumber()).toBe(1);
			expect(adjusted_price.toNumber()).toBe(unit_price.toNumber());
		});
		expect(result.total_items.toNumber()).toBe(
			quantities.reduce(sum, new Decimal(0)).toNumber()
		);
		expect(result.products_total.toNumber()).toBe(
			order.products
				.map(({ quantity, unitPrice }) => new Decimal(quantity).times(unitPrice))
				.reduce(sum, new Decimal(0))
				.toNumber()
		);
		expect(result.total.toNumber()).toBe(result.products_total.toNumber());

		await Promise.all(
			products.map(({ id, stock: oldStock, quantity }) => {
				prisma.product
					.findUniqueOrThrow({
						select: { stock: true },
						where: { id },
					})
					.then(({ stock: updatedStock }) => {
						expect(updatedStock.toNumber()).toBe(
							new Decimal(oldStock).sub(quantity).toNumber()
						);
					});
			})
		);
	});

	test('with 10% discount, neutral price factor', async () => {
		const quantities = [3, 5] as const;
		const products = testProducts.slice(2, 4).map((product, i) => ({
			...product,
			quantity: quantities[i],
		}));

		const order = {
			customerId: testCustomer.id,
			priceFactor: 1,
			discount: 10,
			products: products.map(({ id, price, quantity }) => ({
				id,
				unitPrice: price.toNumber(),
				quantity,
			})),
		} as const satisfies CreateOrderCommand;
		const result = await createOrder(order);
		testOrderIds.push(result.id);

		result.OrderItem.forEach(({ adjusted_price, price_factor, unit_price }) => {
			expect(price_factor.toNumber()).toBe(1);
			expect(adjusted_price.toNumber()).toBe(unit_price.toNumber());
		});
		expect(result.total_items.toNumber()).toBe(
			quantities.reduce(sum, new Decimal(0)).toNumber()
		);
		expect(result.products_total.toNumber()).toBe(
			order.products
				.map(({ quantity, unitPrice }) => new Decimal(quantity).times(unitPrice))
				.reduce(sum, new Decimal(0))
				.toNumber()
		);
		expect(result.total.toNumber()).toBe(
			result.products_total
				.times(new Decimal(100).sub(order.discount))
				.dividedBy(100)
				.toNumber()
		);

		await Promise.all(
			products.map(({ id, stock: oldStock, quantity }) => {
				prisma.product
					.findUniqueOrThrow({
						select: { stock: true },
						where: { id },
					})
					.then(({ stock: updatedStock }) => {
						expect(updatedStock.toNumber()).toBe(
							new Decimal(oldStock).sub(quantity).toNumber()
						);
					});
			})
		);
	});

	test('no discount, price lowered', async () => {
		const quantities = [5, 7] as const;
		const products = testProducts.slice(4, 6).map((product, i) => ({
			...product,
			quantity: quantities[i],
		}));

		const order = {
			customerId: testCustomer.id,
			priceFactor: 1,
			products: products.map(({ id, price, quantity }) => ({
				id,
				unitPrice: price.toNumber(),
				quantity,
			})),
		} as const satisfies CreateOrderCommand;
		const result = await createOrder(order);
		testOrderIds.push(result.id);

		result.OrderItem.forEach(({ adjusted_price, price_factor, unit_price }) => {
			expect(price_factor.toNumber()).toBe(order.priceFactor);
			expect(adjusted_price.toNumber()).toBe(unit_price.times(order.priceFactor).toNumber());
		});
		expect(result.total_items.toNumber()).toBe(
			quantities.reduce(sum, new Decimal(0)).toNumber()
		);
		expect(result.products_total.toNumber()).toBe(
			order.products
				.map(({ quantity, unitPrice }) => new Decimal(quantity).times(unitPrice))
				.reduce(sum, new Decimal(0))
				.times(order.priceFactor)
				.toNumber()
		);
		expect(result.total.toNumber()).toBe(result.products_total.toNumber());

		await Promise.all(
			products.map(({ id, stock: oldStock, quantity }) => {
				prisma.product
					.findUniqueOrThrow({
						select: { stock: true },
						where: { id },
					})
					.then(({ stock: updatedStock }) => {
						expect(updatedStock.toNumber()).toBe(
							new Decimal(oldStock).sub(quantity).toNumber()
						);
					});
			})
		);
	});

	test('no discount, price raised', async () => {
		const quantities = [6, 8] as const;
		const products = testProducts.slice(6, 8).map((product, i) => ({
			...product,
			quantity: quantities[i],
		}));

		const order = {
			customerId: testCustomer.id,
			priceFactor: 1,
			products: products.map(({ id, price, quantity }) => ({
				id,
				unitPrice: price.toNumber(),
				quantity,
			})),
		} as const satisfies CreateOrderCommand;
		const result = await createOrder(order);
		testOrderIds.push(result.id);

		result.OrderItem.forEach(({ adjusted_price, price_factor, unit_price }) => {
			expect(price_factor.toNumber()).toBe(order.priceFactor);
			expect(adjusted_price.toNumber()).toBe(unit_price.times(order.priceFactor).toNumber());
		});
		expect(result.total_items.toNumber()).toBe(
			quantities.reduce(sum, new Decimal(0)).toNumber()
		);
		expect(result.products_total.toNumber()).toBe(
			order.products
				.map(({ quantity, unitPrice }) => new Decimal(quantity).times(unitPrice))
				.reduce(sum, new Decimal(0))
				.times(order.priceFactor)
				.toNumber()
		);
		expect(result.total.toNumber()).toBe(result.products_total.toNumber());

		await Promise.all(
			products.map(({ id, stock: oldStock, quantity }) => {
				prisma.product
					.findUniqueOrThrow({
						select: { stock: true },
						where: { id },
					})
					.then(({ stock: updatedStock }) => {
						expect(updatedStock.toNumber()).toBe(
							new Decimal(oldStock).sub(quantity).toNumber()
						);
					});
			})
		);
	});

	test('20% discount, price lowered', async () => {
		const quantities = [5, 7] as const;
		const products = testProducts.slice(8, 10).map((product, i) => ({
			...product,
			quantity: quantities[i],
		}));

		const order = {
			customerId: testCustomer.id,
			priceFactor: 1,
			discount: 20,
			products: products.map(({ id, price, quantity }) => ({
				id,
				unitPrice: price.toNumber(),
				quantity,
			})),
		} as const satisfies CreateOrderCommand;
		const result = await createOrder(order);
		testOrderIds.push(result.id);

		result.OrderItem.forEach(({ adjusted_price, price_factor, unit_price }) => {
			expect(price_factor.toNumber()).toBe(order.priceFactor);
			expect(adjusted_price.toNumber()).toBe(unit_price.times(order.priceFactor).toNumber());
		});
		expect(result.total_items.toNumber()).toBe(
			quantities.reduce(sum, new Decimal(0)).toNumber()
		);
		expect(result.products_total.toNumber()).toBe(
			order.products
				.map(({ quantity, unitPrice }) => new Decimal(quantity).times(unitPrice))
				.reduce(sum, new Decimal(0))
				.times(order.priceFactor)
				.toNumber()
		);
		expect(result.total.toNumber()).toBe(
			result.products_total
				.times(new Decimal(100).sub(order.discount))
				.dividedBy(100)
				.toNumber()
		);

		await Promise.all(
			products.map(({ id, stock: oldStock, quantity }) => {
				prisma.product
					.findUniqueOrThrow({
						select: { stock: true },
						where: { id },
					})
					.then(({ stock: updatedStock }) => {
						expect(updatedStock.toNumber()).toBe(
							new Decimal(oldStock).sub(quantity).toNumber()
						);
					});
			})
		);
	});

	test('30% discount, price raised', async () => {
		const quantities = [6, 8] as const;
		const products = testProducts.slice(10, 12).map((product, i) => ({
			...product,
			quantity: quantities[i],
		}));

		const order = {
			customerId: testCustomer.id,
			priceFactor: 1,
			discount: 30,
			products: products.map(({ id, price, quantity }) => ({
				id,
				unitPrice: price.toNumber(),
				quantity,
			})),
		} as const satisfies CreateOrderCommand;
		const result = await createOrder(order);
		testOrderIds.push(result.id);

		result.OrderItem.forEach(({ adjusted_price, price_factor, unit_price }) => {
			expect(price_factor.toNumber()).toBe(order.priceFactor);
			expect(adjusted_price.toNumber()).toBe(unit_price.times(order.priceFactor).toNumber());
		});
		expect(result.total_items.toNumber()).toBe(
			quantities.reduce(sum, new Decimal(0)).toNumber()
		);
		expect(result.products_total.toNumber()).toBe(
			order.products
				.map(({ quantity, unitPrice }) => new Decimal(quantity).times(unitPrice))
				.reduce(sum, new Decimal(0))
				.times(order.priceFactor)
				.toNumber()
		);
		expect(result.total.toNumber()).toBe(
			result.products_total
				.times(new Decimal(100).sub(order.discount))
				.dividedBy(100)
				.toNumber()
		);

		await Promise.all(
			products.map(({ id, stock: oldStock, quantity }) => {
				prisma.product
					.findUniqueOrThrow({
						select: { stock: true },
						where: { id },
					})
					.then(({ stock: updatedStock }) => {
						expect(updatedStock.toNumber()).toBe(
							new Decimal(oldStock).sub(quantity).toNumber()
						);
					});
			})
		);
	});
});
