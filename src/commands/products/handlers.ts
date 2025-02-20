import prisma from 'utils/prisma';
import { GetProductsCommand } from './commands';

export const getProducts = (_data: GetProductsCommand) => prisma.product.findMany();
