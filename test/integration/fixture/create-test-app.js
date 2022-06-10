'use strict';

const hijackExpressRender = require('../../../lib/hijack-express-render');
const httpRequest = require('axios');

module.exports = async function createTestApp(expressModule) {
	const express = require(expressModule);

	// Create an Express app and hijack the render methods
	// so that `render` produces JSON output
	const app = hijackExpressRender(express(), async (view, options) => { // eslint-disable-line require-await
		if (view === 'error') {
			throw new Error('render error');
		}
		return {
			view,
			options
		};
	});

	app.locals = {
		is: 'app',
		isAppLocal: true
	};

	// Add a home route, this one will render fine
	app.get('/', (request, response) => {
		response.locals = {
			is: 'response',
			isResponseLocal: true
		};
		response.render('home', {
			is: 'home',
			isHome: true
		});
	});

	// Add an error route, this will cause an error in the renderer
	app.get('/error', (request, response) => {
		response.render('error', {
			is: 'error',
			isError: true
		});
	});

	// Add an error handler so that we can see the error in our tests
	app.use((error, request, response, next) => { // eslint-disable-line no-unused-vars
		response.status(500);
		response.send({
			error: {
				message: error.message
			}
		});
	});

	// Start the server and get the application address
	const server = await start(app);
	const address = `http://localhost:${server.address().port}`;

	/**
	 * Stop the application.
	 */
	function stop() {
		server.close();
	}

	/**
	 * Method to make a GET request to the test application.
	 *
	 * @param {string} requestPath
	 *     The path to make a request to.
	 * @returns {httpRequest.AxiosResponse}
	 *     Returns an HTTP response object.
	 */
	function get(requestPath) {
		return httpRequest({
			url: `${address}${requestPath}`,
			validateStatus() {
				return true;
			}
		});
	}

	// Return the two methods that we need
	return {
		get,
		stop
	};
};

/**
 * Start the application.
 *
 * @param {import('express').Application} app
 *     The Express application to start.
 * @returns {Promise<import('http').Server>}
 *     Returns the started HTTP server.
 */
function start(app) {
	return new Promise((resolve, reject) => {
		const server = app.listen(undefined, error => {
			if (error) {
				return reject(error);
			}
			resolve(server);
		});
	});
}
