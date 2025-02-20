import { RequestHandler } from 'express';

import { ValidatorSchemas } from './types';

const validator =
	(schemas: ValidatorSchemas): RequestHandler =>
	(req, _res, next) => {
		if (!req.parsed) req.parsed = {};
		for (const [_key, schema] of Object.entries(schemas)) {
			const key = _key as keyof ValidatorSchemas;
			req.parsed[key] = schema.validateSync(req[key]);
		}
		next();
	};

export default validator;
