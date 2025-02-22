import { ErrorRequestHandler } from 'express';

const handler: ErrorRequestHandler = (err, _req, res, _next) => {
	res.status(500);

	if (err instanceof Error) {
		res.json({ err: err.message });
	}

	res.end();
};

export default handler;
