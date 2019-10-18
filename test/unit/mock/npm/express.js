'use strict';

const sinon = require('sinon');

const mockApp = {
	locals: {
		is: 'app',
		isLocal: 'app',
		isAppLocal: true
	},
	render: sinon.stub().yieldsAsync()
};

const express = module.exports = sinon.stub().returns(mockApp);
express.mockApp = mockApp;
