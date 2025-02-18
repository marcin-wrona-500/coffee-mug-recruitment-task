// This utility allows to use a single instance of the prisma client
// across the entire app. Simply import this instance instead of creating
// a new one every time.

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
