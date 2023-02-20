
# @rowanmanning/hijack-express-render

Override an [Express](https://expressjs.com) (4.x) application's render methods. This function replaces the `app.render` and `response.render` methods of an Express application, allowing you to bypass Express view rendering entirely.

This allows you to implement your own template resolution and caching, but retain the standard Express API.

**:warning: This is probably a bad idea, and prone to breaking if Express changes the way it renders things**


## Table of Contents

  * [Requirements](#requirements)
  * [Usage](#usage)
  * [Contributing](#contributing)
  * [License](#license)


## Requirements

This library requires the following to run:

  * [Node.js](https://nodejs.org/) 16+


## Usage

Install with [npm](https://www.npmjs.com/):

```sh
npm install @rowanmanning/hijack-express-render
```

Load the library into your code with a `require` call:

```js
const hijackExpressRender = require('@rowanmanning/hijack-express-render');
```

Create an [Express](https://expressjs.com) application and call `hijackExpressRender` with this and a new render method (see [Render Methods](#render-methods) below):

```js
const express = require('express');
const hijackExpressRender = require('@rowanmanning/hijack-express-render');

const app = express();
hijackExpressRender(app, yourRenderMethod);
```

The `hijackExpressRender` also returns the Express application, so you can do this in one line:

```js
const app = hijackExpressRender(express(), yourRenderMethod);
```

Hijacking of the render methods must happen before any middleware that uses `app.render` or `response.render`. It's safest to hijack immediately after creating the Express application.

### Render Methods

The render method you can pass into `hijackExpressRender` must:

  1. Accept two parameters…
      1. **`view`:** The name of the view to render (normally a string). This will not be relative to the Express "view" directory – it is exactly what was passed into `app.render` or `response.render`. Your method must handle its own template resolution and caching. You may also use a non-string here if your renderer supports this
      2. **`context`:** The render context (as an object). This will be defaulted using `app.locals` and `response.locals` in the same way as the default Express rendering engine
  2. Return a `Promise` which resolves with the rendered template. This is normally a string but can be any type that's accepted by `response.send`

Example with a Promise:

```js
function renderMethod(view, context) {
    return Promise.resolve('result');
}
```

Example with an async function:

```js
async function renderMethod(view, context) {
    return 'result';
}
```


## Contributing

[The contributing guide is available here](docs/contributing.md). All contributors must follow [this library's code of conduct](docs/code_of_conduct.md).


## License

Licensed under the [MIT](LICENSE) license.<br/>
Copyright &copy; 2019, Rowan Manning
