'use strict';

const {assert} = require('chai');
const td = require('testdouble');

describe('lib/hijack-express-render', () => {
	let hijackExpressRender;
	let mockExpressApp;

	beforeEach(() => {
		hijackExpressRender = require('../../../lib/hijack-express-render');
	});

	describe('hijackExpressRender(app, newRenderMethod)', () => {
		let newRenderMethod;
		let originalAppRender;
		let returnValue;

		beforeEach(() => {
			mockExpressApp = {
				locals: {
					is: 'app',
					isLocal: 'app',
					isAppLocal: true
				},
				render: td.func()
			};
			td.when(mockExpressApp.render(), {
				ignoreExtraArgs: true,
				defer: true
			}).thenCallback();
			originalAppRender = mockExpressApp.render;
			newRenderMethod = td.func();
			td.when(newRenderMethod(), {
				ignoreExtraArgs: true,
				defer: true
			}).thenResolve('mock html');
			returnValue = hijackExpressRender(mockExpressApp, newRenderMethod);
		});

		it('replaces `app.render` with a new method', () => {
			assert.isFunction(mockExpressApp.render);
			assert.notStrictEqual(mockExpressApp.render, originalAppRender);
		});

		it('returns `app`', () => {
			assert.strictEqual(returnValue, mockExpressApp);
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
				mockExpressApp.render('mock view', options, (error, result) => {
					callbackError = error;
					callbackResult = result;
					done();
				});
			});

			it('calls `newRenderMethod` with `view` and `options` merged with `app.locals` and `app.locals._locals`', () => {
				td.verify(newRenderMethod('mock view', {
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
				}), {times: 1});
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
					td.when(newRenderMethod(), {
						ignoreExtraArgs: true,
						defer: true
					}).thenReject(renderError);
					mockExpressApp.render('mock view', options, (error, result) => {
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
				mockExpressApp.render('mock view', (error, result) => {
					callbackError = error;
					callbackResult = result;
					done();
				});
			});

			it('calls `newRenderMethod` with `view` and `app.locals` and `app.locals._locals`', () => {
				td.verify(newRenderMethod('mock view', {
					is: 'app',
					isAppLocal: true,
					isLocal: 'app'
				}), {times: 1});
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
					td.when(newRenderMethod(), {
						ignoreExtraArgs: true,
						defer: true
					}).thenReject(renderError);
					mockExpressApp.render('mock view', (error, result) => {
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

	describe('.default', () => {
		it('aliases the module exports', () => {
			assert.strictEqual(hijackExpressRender, hijackExpressRender.default);
		});
	});

});
