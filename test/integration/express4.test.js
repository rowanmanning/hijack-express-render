'use strict';

const assert = require('node:assert');
const createTestApp = require('./fixture/create-test-app');

describe('Express 4', () => {
	let app;

	before(async () => {
		app = await createTestApp('express4');
	});

	after(() => {
		app.stop();
	});

	describe('GET /', () => {
		let response;

		beforeEach(async () => {
			response = await app.get('/');
		});

		it('responds with a 200 status', () => {
			assert.strictEqual(response.status, 200);
		});

		it('responds with the rendered view', () => {
			assert.strictEqual(typeof response.data, 'object');
			assert.strictEqual(response.data.view, 'home');
			assert.strictEqual(typeof response.data.options, 'object');
			assert.strictEqual(response.data.options.isHome, true);
			assert.strictEqual(response.data.options.isAppLocal, true);
			assert.strictEqual(response.data.options.isResponseLocal, true);
		});

	});

	describe('GET /error', () => {
		let response;

		beforeEach(async () => {
			response = await app.get('/error');
		});

		it('responds with a 500 status', () => {
			assert.strictEqual(response.status, 500);
		});

		it('responds with an error view', () => {
			assert.strictEqual(typeof response.data, 'object');
			assert.strictEqual(typeof response.data.error, 'object');
			assert.strictEqual(response.data.error.message, 'render error');
		});

	});

});
