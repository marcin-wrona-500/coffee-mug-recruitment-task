import express from 'express';

const PORT = process.env.PORT ?? 80;

const app = express();

app.use((_req, res) => {
	res.send('Hello world from Express');
});

app.listen(PORT);
