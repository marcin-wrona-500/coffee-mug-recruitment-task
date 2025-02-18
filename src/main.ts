import dotenv from 'dotenv';
import express from 'express';

dotenv.config({
	override: true,
	path: ['.env', '.env.local'],
});

const PORT = process.env.PORT ?? 80;

const app = express();

app.use((_req, res) => {
	res.send('Hello world from Express');
});

app.listen(PORT);
