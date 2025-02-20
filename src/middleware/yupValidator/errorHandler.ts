import { ErrorRequestHandler } from 'express';

import { ValidationError } from 'yup';

const handler: ErrorRequestHandler = (err, _req, res, next) => {
	if (!(err instanceof ValidationError)) return next(err);

	// set appropriate status: client error, they gave us bad parameters
	res.status(400);
	// send back the error from Yup so they have a hint as to what is wrong
	res.json(err);
};

export default handler;
