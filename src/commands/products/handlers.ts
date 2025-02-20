import prisma from 'utils/prisma';
import { CreateProductCommand, GetProductsCommand, IncreaseStockCommand } from './commands';

export const getProducts = (_data: GetProductsCommand) => prisma.product.findMany();

export const createProduct = (data: CreateProductCommand) => prisma.product.create({ data });

export const increaseStock = ({ id, amount }: IncreaseStockCommand) =>
	prisma.product.update({
		data: { stock: { increment: amount } },
		where: { id },
	});
