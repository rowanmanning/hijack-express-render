'use strict';

const assert = require('proclaim');
const sinon = require('sinon');

describe('lib/hijack-express-render', () => {
	let express;
	let hijackExpressRender;

	beforeEach(() => {
		express = require('../mock/npm/express');
		hijackExpressRender = require('../../../lib/hijack-express-render');
	});

	describe('hijackExpressRender(app, newRenderMethod)', () => {
		let app;
		let newRenderMethod;
		let originalAppRender;
		let returnValue;

		beforeEach(() => {
			app = express();
			originalAppRender = app.render;
			newRenderMethod = sinon.stub().resolves('mock html');
			returnValue = hijackExpressRender(app, newRenderMethod);
		});

		it('replaces `app.render` with a new method', () => {
			assert.isFunction(app.render);
			assert.notStrictEqual(app.render, originalAppRender);
		});

		it('returns `app`', () => {
			assert.strictEqual(returnValue, app);
		});

		describe('app.render(view, options, callback)', () => {
			let options;
			let callbackError;
			let callbackResult;

			beforeEach(done => {
				options = {
					is: 'options',
					isOptions: true,
					_locals: {
						is: 'response',
						isLocal: 'response',
						isResponseLocal: true
					}
				};
				app.render('mock view', options, (error, result) => {
					callbackError = error;
					callbackResult = result;
					done();
				});
			});

			it('calls `newRenderMethod` with `view` and `options` merged with `app.locals` and `app.locals._locals`', () => {
				assert.calledOnce(newRenderMethod);
				assert.strictEqual(newRenderMethod.firstCall.args[0], 'mock view');
				assert.deepEqual(newRenderMethod.firstCall.args[1], {
					is: 'options',
					isAppLocal: true,
					isResponseLocal: true,
					isLocal: 'response',
					isOptions: true,
					_locals: {
						is: 'response',
						isLocal: 'response',
						isResponseLocal: true
					}
				});
			});

			it('calls back with no error', () => {
				assert.isNull(callbackError);
			});

			it('calls back with the result of the render', () => {
				assert.strictEqual(callbackResult, 'mock html');
			});

			describe('when `newRenderMethod` rejects', () => {
				let renderError;

				beforeEach(done => {
					renderError = new Error('mock render error');
					newRenderMethod.reset();
					newRenderMethod.rejects(renderError);
					app.render('mock view', options, (error, result) => {
						callbackError = error;
						callbackResult = result;
						done();
					});
				});

				it('calls back with the error', () => {
					assert.strictEqual(callbackError, renderError);
				});

				it('calls back with no result', () => {
					assert.isUndefined(callbackResult);
				});

			});

		});

		describe('app.render(view, callback)', () => {
			let callbackError;
			let callbackResult;

			beforeEach(done => {
				app.render('mock view', (error, result) => {
					callbackError = error;
					callbackResult = result;
					done();
				});
			});

			it('calls `newRenderMethod` with `view` and `app.locals` and `app.locals._locals`', () => {
				assert.calledOnce(newRenderMethod);
				assert.strictEqual(newRenderMethod.firstCall.args[0], 'mock view');
				assert.deepEqual(newRenderMethod.firstCall.args[1], {
					is: 'app',
					isAppLocal: true,
					isLocal: 'app'
				});
			});

			it('calls back with no error', () => {
				assert.isNull(callbackError);
			});

			it('calls back with the result of the render', () => {
				assert.strictEqual(callbackResult, 'mock html');
			});

			describe('when `newRenderMethod` rejects', () => {
				let renderError;

				beforeEach(done => {
					renderError = new Error('mock render error');
					newRenderMethod.reset();
					newRenderMethod.rejects(renderError);
					app.render('mock view', (error, result) => {
						callbackError = error;
						callbackResult = result;
						done();
					});
				});

				it('calls back with the error', () => {
					assert.strictEqual(callbackError, renderError);
				});

				it('calls back with no result', () => {
					assert.isUndefined(callbackResult);
				});

			});

		});

	});

});
