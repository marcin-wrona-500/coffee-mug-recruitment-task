import { ValidatorSchemaKeys } from 'middleware/yupValidator';

type ParsedData = Partial<Record<ValidatorSchemaKeys, object>>;

declare global {
	namespace Express {
		export interface Request {
			parsed: ParsedData;
		}
	}
}
