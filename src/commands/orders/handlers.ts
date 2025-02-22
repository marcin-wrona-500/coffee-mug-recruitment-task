import Decimal from 'decimal.js';
import { countries } from 'countries-list';

import { decreaseStock, DecreaseStockCommand } from 'commands/products';
import prisma from 'utils/prisma';
import { sum } from 'utils/arrays';

import { CreateOrderCommand, GetDiscountCommand, GetPriceFactorCommand } from './commands';
import allDiscounts from './discounts';

export const createOrder = ({
	customerId,
	discount,
	priceFactor,
	products,
}: CreateOrderCommand) => {
	const stockUpdateCommands = products.map<DecreaseStockCommand>(({ id, quantity }) => ({
		id,
		amount: quantity,
	}));
	const stockUpdates = stockUpdateCommands.map((command) => decreaseStock(command));

	const productsWithTotals = products
		.map(({ quantity, unitPrice, ...rest }) => ({
			quantity,
			unitPrice,
			...rest,
			adjustedPrice: new Decimal(unitPrice).times(priceFactor),
		}))
		.map(({ quantity, adjustedPrice, ...rest }) => ({
			quantity,
			adjustedPrice,
			...rest,
			total: adjustedPrice.times(quantity),
		}));

	const totalItems = products.map(({ quantity }) => quantity).reduce(sum, new Decimal(0));
	const productsTotal = productsWithTotals.map(({ total }) => total).reduce(sum, new Decimal(0));
	const orderTotal = discount
		? productsTotal.sub(productsTotal.times(discount).dividedBy(100))
		: productsTotal;

	const orderCreation = prisma.order.create({
		include: { OrderItem: true },
		data: {
			id_Customer: customerId,
			total_items: totalItems,
			products_total: productsTotal,
			discount: discount,
			total: orderTotal,
			OrderItem: {
				create: productsWithTotals.map(({ id, unitPrice, adjustedPrice, ...rest }) => ({
					Product: { connect: { id } },
					unit_price: unitPrice,
					adjusted_price: adjustedPrice,
					...rest,
					price_factor: priceFactor,
				})),
			},
		},
	});

	// do all operations in one DB transaction
	// this will not allow order creation if there is not enough stock
	return prisma.$transaction([orderCreation, ...stockUpdates]).then(([order]) => order);
};

export const getDiscount = (data: GetDiscountCommand) => {
	const applicableDiscounts = allDiscounts
		.filter(({ isApplicable }) => isApplicable(data))
		.map(({ percent }) => percent);
	const highestDiscount = applicableDiscounts.toSorted((a, b) => b - a).at(0);

	return highestDiscount;
};

export const getPriceFactor = ({ country: code }: GetPriceFactorCommand) => {
	if (code === 'US') {
		// USA gets standard pricing
		return 1;
	}

	const { continent } = countries[code];
	switch (continent) {
		case 'EU':
			// need to charge for VAT for EU orders
			return 1.15;
		case 'AS':
			// lower pricing for Asian orders due to lower logistics cost
			return 0.95;
		default:
			// standard pricing otherwise
			return 1;
	}
};
