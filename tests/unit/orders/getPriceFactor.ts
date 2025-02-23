import { describe, expect, test } from '@jest/globals';

import { getPriceFactor } from 'commands/orders';

describe('price factors for different continents', () => {
	test('standard pricing for the US', () => {
		expect(getPriceFactor({ country: 'US' })).toBe(1);
	});

	describe('price increased by VAT for European countries', () => {
		const expected = 1.15;

		test('Poland', () => {
			expect(getPriceFactor({ country: 'PL' })).toBe(expected);
		});
		test('Germany', () => {
			expect(getPriceFactor({ country: 'DE' })).toBe(expected);
		});
		test('France', () => {
			expect(getPriceFactor({ country: 'FR' })).toBe(expected);
		});
		test('Ukraine', () => {
			expect(getPriceFactor({ country: 'UA' })).toBe(expected);
		});
	});

	describe('lowered logistics costs for Asian countries', () => {
		const expected = 0.95;

		test('China', () => {
			expect(getPriceFactor({ country: 'CN' })).toBe(expected);
		});
		test('Japan', () => {
			expect(getPriceFactor({ country: 'JP' })).toBe(expected);
		});
		test('Vietnam', () => {
			expect(getPriceFactor({ country: 'VN' })).toBe(expected);
		});
		test('Taiwan', () => {
			expect(getPriceFactor({ country: 'TW' })).toBe(expected);
		});
	});

	describe('standard pricing elsewhere', () => {
		const expected = 1;

		test('Canada', () => {
			expect(getPriceFactor({ country: 'CA' })).toBe(expected);
		});

		describe('America', () => {
			test('Argentina', () => {
				expect(getPriceFactor({ country: 'AR' })).toBe(expected);
			});
			test('Brasil', () => {
				expect(getPriceFactor({ country: 'BR' })).toBe(expected);
			});
			test('Mexico', () => {
				expect(getPriceFactor({ country: 'MX' })).toBe(expected);
			});
			test('Chile', () => {
				expect(getPriceFactor({ country: 'CL' })).toBe(expected);
			});
		});

		describe('Oceania', () => {
			test('Australia', () => {
				expect(getPriceFactor({ country: 'AU' })).toBe(expected);
			});
			test('New Zealand', () => {
				expect(getPriceFactor({ country: 'NZ' })).toBe(expected);
			});
			test('Papua New Guinea', () => {
				expect(getPriceFactor({ country: 'PG' })).toBe(expected);
			});
			test('Solomon Islands', () => {
				expect(getPriceFactor({ country: 'SB' })).toBe(expected);
			});
		});

		describe('Africa', () => {
			test('Algeria', () => {
				expect(getPriceFactor({ country: 'DZ' })).toBe(expected);
			});
			test('Chad', () => {
				expect(getPriceFactor({ country: 'TD' })).toBe(expected);
			});
			test('Egypt', () => {
				expect(getPriceFactor({ country: 'EG' })).toBe(expected);
			});
			test('South Africa', () => {
				expect(getPriceFactor({ country: 'ZA' })).toBe(expected);
			});
		});

		test('Antarctica', () => {
			expect(getPriceFactor({ country: 'AQ' })).toBe(expected);
		});
		test('Greenland', () => {
			expect(getPriceFactor({ country: 'GL' })).toBe(expected);
		});
	});
});
