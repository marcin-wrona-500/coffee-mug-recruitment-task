import prisma from 'utils/prisma';

import { GetCustomerCommand } from './commands';

export const getCustomer = ({ id }: GetCustomerCommand) =>
	prisma.customer.findUnique({ where: { id } });
