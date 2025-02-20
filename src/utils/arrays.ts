import { Decimal } from 'decimal.js';

export const sum = (acc: Decimal, curr: Decimal.Value) => acc.plus(curr);
