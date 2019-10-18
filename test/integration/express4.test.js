'use strict';

const assert = require('proclaim');
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
			assert.strictEqual(response.statusCode, 200);
		});

		it('responds with the rendered view', () => {
			assert.isObject(response.body);
			assert.strictEqual(response.body.view, 'home');
			assert.isObject(response.body.options);
			assert.isTrue(response.body.options.isHome);
			assert.isTrue(response.body.options.isAppLocal);
			assert.isTrue(response.body.options.isResponseLocal);
		});

	});

	describe('GET /error', () => {
		let response;

		beforeEach(async () => {
			response = await app.get('/error');
		});

		it('responds with a 500 status', () => {
			assert.strictEqual(response.statusCode, 500);
		});

		it('responds with an error view', () => {
			assert.isObject(response.body);
			assert.isObject(response.body.error);
			assert.strictEqual(response.body.error.message, 'render error');
		});

	});

});
