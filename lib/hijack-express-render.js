'use strict';

/**
 * Override an Express application's render methods.
 *
 * Calling this function on an Express application replaces the
 * `app.render` method, allowing you to bypass Express view
 * rendering entirely, even when using `response.render`.
 *
 * @public
 * @param {import('express').Application} app
 *     The Express application to override.
 * @param {RenderMethod} newRenderMethod
 *     The new method to use when rendering views.
 * @returns {import('express').Application}
 *     Returns the app.
 */
function hijackExpressRender(app, newRenderMethod) {
	app.render = function render(renderView, renderOptions, renderCallback) {
		const {view, options, callback} = defaultRenderParams(
			renderView,
			renderOptions,
			renderCallback
		);
		const context = Object.assign({}, app.locals, options._locals, options);
		newRenderMethod(view, context)
			.then(string => callback(null, string))
			.catch(error => callback(error));
	};
	return app;
}

/**
 * A hijacked Express render method.
 *
 * @callback RenderMethod
 * @param {any} view
 *     The name of the view to render.
 *     This will not be relative to the Express "view"
 *     directory – it is exactly what was passed into
 *     `app.render` or `response.render`.
 * @param {object} context
 *     The render context, defaulted using `app.locals`
 *     and `response.locals` in the same way as the default
 *     Express rendering engine.
 * @returns {Promise<*>}
 *     Returns the rendered template, normally as a String.
 */

/**
 * Get defaulted render parameters in the same way as Express.
 *
 * @private
 * @param {any} view
 *     The view to render.
 * @param {any} [options]
 *     The render context.
 * @param {Function} [callback]
 *     A callback to use when the rendering is complete.
 * @returns {object}
 *     Returns an object with `view`, `options`, and `callback` properties.
 */
function defaultRenderParams(view, options, callback) {
	if (typeof options === 'function') {
		callback = options;
		options = {};
	}
	return {
		view,
		options,
		callback
	};
}

module.exports = hijackExpressRender;
module.exports.default = module.exports;
