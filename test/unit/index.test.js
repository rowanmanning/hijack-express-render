'use strict';

const assert = require('proclaim');

describe('index', () => {
	let index;
	let hijackExpressRender;

	beforeEach(() => {
		index = require('../../index');
		hijackExpressRender = require('../../lib/hijack-express-render');
	});

	it('aliases `lib/hijack-express-render`', () => {
		assert.strictEqual(index, hijackExpressRender);
	});

});
