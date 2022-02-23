'use strict';

const {assert} = require('chai');
const createTestApp = require('./fixture/create-test-app');

describe('Express 5', () => {
	let app;

	before(async () => {
		app = await createTestApp('express5');
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
			assert.isObject(response.data);
			assert.strictEqual(response.data.view, 'home');
			assert.isObject(response.data.options);
			assert.isTrue(response.data.options.isHome);
			assert.isTrue(response.data.options.isAppLocal);
			assert.isTrue(response.data.options.isResponseLocal);
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
			assert.isObject(response.data);
			assert.isObject(response.data.error);
			assert.strictEqual(response.data.error.message, 'render error');
		});

	});

});
