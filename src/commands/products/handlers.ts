import prisma from 'utils/prisma';
import { CreateProductCommand, GetProductsCommand } from './commands';

export const getProducts = (_data: GetProductsCommand) => prisma.product.findMany();

export const createProduct = (data: CreateProductCommand) => prisma.product.create({ data });
