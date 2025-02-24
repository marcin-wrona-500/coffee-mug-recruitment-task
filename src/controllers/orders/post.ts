import { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';

import {
	CreateOrderCommand,
	GetDiscountCommand,
	createOrder,
	getDiscount,
	GetPriceFactorCommand,
	getPriceFactor,
} from 'commands/orders';
import { getCustomer, GetCustomerCommand } from 'commands/customers';
import { isProductNotFoundError } from 'controllers/products/errors';
import prisma from 'utils/prisma';

import { OrdersPostBodySchema } from './types';

const handler: RequestHandler = expressAsyncHandler(async (req, res) => {
	const body = req.parsed.body as OrdersPostBodySchema;

	const productData = await Promise.all(
		body.products.map<Promise<CreateOrderCommand['products'][number]>>(({ id, ...rest }) =>
			prisma.product
				.findUniqueOrThrow({
					select: { price: true },
					where: { id },
				})
				.catch((err) => {
					if (isProductNotFoundError(err)) err.meta.recordId = id;
					throw err;
				})
				.then(({ price }) => ({
					id,
					...rest,
					unitPrice: price.toNumber(),
				}))
		)
	);

	const getCustomerCommand: GetCustomerCommand = { id: body.customerId };
	const customer = await getCustomer(getCustomerCommand);

	if (!customer) {
		res.status(400).json({ error: 'A customer with the specified ID does not exist' });
		return;
	}

	const getPriceFactorCommand: GetPriceFactorCommand = { country: customer.country };
	const priceFactor = getPriceFactor(getPriceFactorCommand);

	const command: CreateOrderCommand = {
		...body,
		products: productData,
		priceFactor,
	};

	const getDiscountCommand: GetDiscountCommand = { order: command };
	command.discount = getDiscount(getDiscountCommand);

	await createOrder(command);

	res.end();
});

export default handler;
