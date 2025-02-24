import { CreateOrderCommand, createOrderCommand } from 'commands/orders';
import * as yup from 'yup';

export const ordersPostBodySchema = createOrderCommand.omit(['discount', 'priceFactor']).shape({
	products: (
		yup.reach(createOrderCommand, 'products') as yup.ArraySchema<
			CreateOrderCommand['products'],
			yup.AnyObject
		>
	).of(
		(
			yup.reach(createOrderCommand, 'products[0]') as yup.ObjectSchema<
				CreateOrderCommand['products'][number]
			>
		).omit(['unitPrice'])
	),
});
export type OrdersPostBodySchema = yup.InferType<typeof ordersPostBodySchema>;
