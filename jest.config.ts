import type { Config } from 'jest';

const config: Config = {
	testEnvironment: 'node',
	transform: { '^.+\\.ts$': 'ts-jest' },
	testMatch: ['<rootDir>/tests/**/*.ts'],
};

export default config;
