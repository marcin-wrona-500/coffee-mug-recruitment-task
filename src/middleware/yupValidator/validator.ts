import { RequestHandler, Request } from 'express';

import { ValidatorSchemas } from './types';

const validator =
	(schemas: ValidatorSchemas): RequestHandler =>
	(req, _res, next) => {
		for (const [key, schema] of Object.entries(schemas)) {
			const data = req[key as keyof Request];
			schema.validateSync(data);
		}
		next();
	};

export default validator;
