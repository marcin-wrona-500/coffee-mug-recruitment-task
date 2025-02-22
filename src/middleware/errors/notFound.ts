import { RequestHandler } from 'express';

const handler: RequestHandler = (_req, res) => {
	res.status(404).json({ error: 'Endpoint not found' });
};

export default handler;
