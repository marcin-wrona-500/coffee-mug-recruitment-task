import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export type ProductNotFoundError = PrismaClientKnownRequestError & {
	code: 'P2025';
	meta: Required<PrismaClientKnownRequestError>['meta'] & {
		modelName: 'Product';
		recordId?: number;
	};
};
