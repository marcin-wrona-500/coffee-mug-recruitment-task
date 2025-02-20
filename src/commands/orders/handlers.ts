import Decimal from 'decimal.js';

import prisma from 'utils/prisma';
import { sum } from 'utils/arrays';

import { CreateOrderCommand } from './commands';

export const createOrder = ({ customerId, products }: CreateOrderCommand) => {
	const productsWithTotals = products.map(({ quantity, unitPrice, ...rest }) => ({
		quantity,
		unitPrice,
		...rest,
		total: new Decimal(quantity).times(unitPrice),
	}));
	const totalItems = products.map(({ quantity }) => quantity).reduce(sum, new Decimal(0));
	const orderTotal = productsWithTotals.map(({ total }) => total).reduce(sum, new Decimal(0));

	return prisma.order.create({
		include: { OrderItem: true },
		data: {
			id_Customer: customerId,
			total_items: totalItems,
			total: orderTotal,
			OrderItem: {
				create: productsWithTotals.map(({ id, unitPrice, ...rest }) => ({
					Product: { connect: { id } },
					unit_price: unitPrice,
					...rest,
				})),
			},
		},
	});
};
