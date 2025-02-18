import dotenv from 'dotenv';
import express from 'express';

import routes from './routes';

// make "process.env" match our defined environment variables in TypeScript
import { EnvironmentConfig } from './types/env.d';
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		interface ProcessEnv extends EnvironmentConfig {}
	}
}

dotenv.config({
	override: true,
	path: ['.env', '.env.local'],
});

const app = express();

app.use(routes);

app.listen(process.env.PORT);
