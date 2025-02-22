import Decimal from 'decimal.js';

import { DecreaseStockCommand } from 'commands/products';
import prisma from 'utils/prisma';
import { sum } from 'utils/arrays';

import { CreateOrderCommand } from './commands';

export const createOrder = ({ customerId, products }: CreateOrderCommand) => {
	const stockUpdateCommands = products.map<DecreaseStockCommand>(({ id, quantity }) => ({
		id,
		amount: quantity,
	}));
	const stockUpdates = stockUpdateCommands.map((command) => decreaseStock(command));

	const productsWithTotals = products.map(({ quantity, unitPrice, ...rest }) => ({
		quantity,
		unitPrice,
		...rest,
		total: new Decimal(quantity).times(unitPrice),
	}));
	const totalItems = products.map(({ quantity }) => quantity).reduce(sum, new Decimal(0));
	const orderTotal = productsWithTotals.map(({ total }) => total).reduce(sum, new Decimal(0));
	const orderCreation = prisma.order.create({
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

	// do all operations in one DB transaction
	// this will not allow order creation if there is not enough stock
	return prisma.$transaction([orderCreation, ...stockUpdates]).then(([order]) => order);
};
