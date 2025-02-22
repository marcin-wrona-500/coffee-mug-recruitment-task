import prisma from 'utils/prisma';
import {
	CreateProductCommand,
	GetProductCommand,
	GetProductsCommand,
	IncreaseStockCommand,
} from './commands';

export const getProducts = (_data: GetProductsCommand) => prisma.product.findMany();
export const getProduct = ({ id }: GetProductCommand) =>
	prisma.product.findUnique({ where: { id } });

export const createProduct = (data: CreateProductCommand) => prisma.product.create({ data });

export const increaseStock = ({ id, amount }: IncreaseStockCommand) =>
	prisma.product.update({
		data: { stock: { increment: amount } },
		where: { id },
	});

export const decreaseStock = ({ id, amount }: IncreaseStockCommand) =>
	prisma.product.update({
		data: { stock: { decrement: amount } },
		where: { id },
	});
