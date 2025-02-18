import express from 'express';

const router = express.Router();

router.use((_req, res) => {
	res.send('Hello world from Express');
});

export default router;
