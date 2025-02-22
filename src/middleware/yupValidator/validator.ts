import { RequestHandler } from 'express';
import expressAsyncHandler from 'express-async-handler';

import { ValidatorSchemas } from './types';

const validator = (schemas: ValidatorSchemas): RequestHandler =>
	expressAsyncHandler(async (req, _res, next) => {
		if (!req.parsed) req.parsed = {};
		for (const [_key, schema] of Object.entries(schemas)) {
			const key = _key as keyof ValidatorSchemas;
			req.parsed[key] = await schema.validate(req[key]);
		}
		next();
	});

export default validator;
