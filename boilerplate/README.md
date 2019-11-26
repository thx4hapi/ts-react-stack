# TypeScript React Boilerplate

## Initiate project

```bash
shell> mkdir boilerplate
shell> cd boilerplate
shell> git init
shell> yarn init -y # or npm init -y
shell> mkdir src
```

## Integrate TypeScript with Babel and Webpack

### Installing TypeScript as a dev dependency

```bash
shell> yarn add --dev typescript # or npm install --save-dev typescript

# Generate a default 'tsconfig.json' file in the root directory
shell> ./node_modules/.bin/tsc --init
```

### Configure `tsconfig.json` file

```json
// tsconfig.json

{
  "compilerOptions": {
    // Target latest version of ECMAScript.
    "target": "esnext",
    "module": "commonjs",
    // Specify JSX code generation
    "jsx": "preserve",
    // Don't emit; allow Babel to transform files.
    "noEmit": true,
    // Enable strictest settings like strictNullChecks & noImplicitAny.
    "strict": true,
    // Import non-ES modules as default imports.
    "esModuleInterop": true
  },

  "include": [
    "src/**/*"
  ],

  "exclude": [
    "node_modules"
  ]
}
```

Note that we should set the **`noEmit`** property to **true** since we are letting Babel do the transpilation.

We should set the **`jsx`** property to **preserve** since we are building react project.

> See [more about tsconfig.json configuration](https://www.typescriptlang.org/docs/handbook/react-&-webpack.html)

Add ‘type-check’ command to scripts section in `package.json`:

```json
// package.json

"scripts": {
  "type-check": "tsc --watch"
}
```

> Run command
>
> `shell> tsc --watch`
>
> would type-check `.ts` and `.tsx` files.
>
> The `--watch` flag to get immediate feedback when anything changes.

### Adding Babel

Note that the package ecosystem of Babel 7 now exists as a [monorepo](https://github.com/babel/babel/tree/master/packages) and all NPM modules are namespaced behind the `@babel` org address.

Installing the core of Babel - **`@babel/core`** and **`@babel/cli`**(optional)

```bash
shell> yarn add --dev @babel/core @babel/cli # or npm install --save-dev @babel/core @babel/cli
```

Thanks to the Babel preset - **`@babel/preset-typescript`**, Babel 7 supported TypeScript out of the box.

>**References:**
>
>1. [TypeScript and Babel 7](https://devblogs.microsoft.com/typescript/typescript-and-babel-7),
>2. [TypeScript With Babel: A Beautiful Marriage](https://iamturns.com/typescript-babel/)

Installing **`@babel/preset-typescript`**:

```bash
shell> yarn add --dev @babel/preset-typescript # or npm install --save-dev @babel/preset-typescript
```

Installing **`@babel/preset-env`**

**`@babel/preset-env`** is a smart preset that allows you to use the latest JavaScript without needing to micromanage which syntax transforms (and optionally, browser polyfills) are needed by your target environment(s)

```shell
shell> yarn add --dev @babel/preset-env # or npm install --save-dev @babel/preset-env
```

We also probably want to get the other babel plugins that TypeScript support ECMAScript experimental features:

**`@babel/plugin-proposal-class-properties`**

**`@babel/plugin-proposal-object-rest-spread`**

...

```bash
shell> yarn add --dev @babel/plugin-proposal-class-properties @babel/plugin-proposal-object-rest-spread # or npm install --save-dev @babel/plugin-proposal-class-properties @babel/plugin-proposal-object-rest-spread
```

Configure the presets and plugins of Babel with create a new file named **`babel.config.js`** inside the root directory:

```js
// babel.config.js

module.exports = function (api) {
  // Cache the returned value forever and don't call this function again.
  api.cache(true)

  const presets = [
    // Enable Babel to understand TypeScript
    "@babel/preset-typescript",

    // Allows smart transpilation according to target environments
    [ "@babel/env", {
      // Specifying the environments should transpile down to
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      },

      // Enable transformation of ES6 module syntax to another module type.
      "modules": false
    }]
  ]

  const plugins = [
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread"
  ]

  return {
    presets,
    plugins
  }
}
```

> **`@babel/preset-env`** compiling Javascript ES6 code down to ES5
>
> With `@babel/cli`, as run
>
>`babel ./src --out-dir dist --extensions ".ts,.tsx"`
>
>source files should be built and generated in the 'dist' directory.

### Adding Webpack

#### Installing Webpack and related

- `webpack` and `webpack-cli`

```bash
shell> yarn add --dev webpack webpack-cli # or npm install --save-dev webpack webpack-cli
```

- `babel-loader`

`babel-loader` is the Webpack loader responsible for transform ES6 code to ES5 with Babel that browser understand.

```bash
shell> yarn add --dev babel-loader # or npm install --save-dev babel-loader
```

- `html-webpack-plugin`

Using the Html WebPack plugin for dynamically generate the HTML file

```bash
shell> yarn add --dev html-webpack-plugin # or npm install --save-dev html-webpack-plugin
```

- [`Webpack Dev Server`](https://webpack.js.org/configuration/dev-server/)

Webpack Dev Server as a development server provides us a lot of features such as watch mode, live reloading and hot module replacement...

Every time save a file webpack dev server will automagically refresh the browser’s window.

> Note it generates assets and keeps them in memory by default.

```bash
shell> yarn add --dev webpack-dev-server # or npm install --save-dev webpack-dev-server
```

#### Configure for Webpack

Create a file named `webpack.config.js` inside root directory

```bash
shell> touch webpack.config.js
```

In the webpack.config.js file, Specify the entry and output points:

```js
// webpack.config.js

const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'src/main.tsx'),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'dist'),
  }
}
```

With the `babel-loader`, Add module section to add a rule. And add the **ts** extension in the resolve section. (Since we are building a react, we have added **tsx** also).

```js
// webpack.config.js

module.exports = {
  module: {
    // In the module section, add a rule.
    rules: [{
      test:  /\.(ts|tsx)$/,
      exclude:  /node_modules/,
      loader: "babel-loader"
    }]
  },
  resolve: {
    // add the .ts | .tsx extension
    extensions: [
      '.js', '.jsx', '.tsx', '.ts', '.json'
    ]
  }
}
```

With the `html-webpack-plugin`, Add **plugins** section.

```js
// webpack.config.js

const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      // Define the template that the plugin will use to generate the HTML
      template: path.resolve(__dirname, 'src/index.html'),
      filename:  "index.html"
    })
  ]
}
```

Add a separate section (with `devServer` name) in the webpack.config.js to specific the configuration of webpack dev server.

```js
// webpack.config.js

module.exports = {
  devServer: {
    // Specify a port number to listen for requests on, default is 8080
    port: 8086,

    // Enable gzip compression for everything served
    compress: true,

    // Tell dev-server to open the browser after server had been started.
    open: true,

    // Tell the server where to serve content from - the directory which look for the index.html file
    // This is only necessary if we want to serve static files.
    // By default it will use current working directory to serve content.
    contentBase: path.resolve(__dirname, 'src'),

    // Indicate the generated bundle files will placed. By default it is an in memory bundle which is not written on disk.
    publicPath: '/dist',

    // Enable Hot Module Replacement feature
    hot: true,

    // Inline mode is recommended for Hot Module Replacement as it includes an HMR trigger from the websocket
    inline: true
  }
}
```

So the last `webpack.config.js` looks like:

```js
// webpack.config.js

const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: path.resolve(__dirname, 'src/main.tsx'),
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    // In the module section, add a rule.
    rules: [{
      test:  /\.(ts|tsx)$/,
      exclude:  /node_modules/,
      loader: "babel-loader"
    }]
  },
  resolve: {
    // add the .ts | .tsx extension
    extensions: [
      '.js', '.jsx', '.tsx', '.ts', '.json'
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      // Define the template that the plugin will use to generate the HTML
      template: path.resolve(__dirname, 'src/index.html'),
      filename:  "index.html"
    })
  ],
  devServer: {
    // Specify a port number to listen for requests on, default is 8080
    port: 8086,

    // Enable gzip compression for everything served
    compress: true,

    // Tell dev-server to open the browser after server had been started.
    open: true,

    // Tell the server where to serve content from - the directory which look for the index.html file
    // This is only necessary if we want to serve static files.
    // By default it will use current working directory to serve content.
    contentBase: path.resolve(__dirname, 'src'),

    // Indicate the generated bundle files will placed. By default it is an in memory bundle which is not written on disk.
    publicPath: '/dist',

    // Enable Hot Module Replacement feature
    hot: true,

    // Inline mode is recommended for Hot Module Replacement as it includes an HMR trigger from the websocket
    inline: true
  }
}
```

> See [more about configuring webpack](https://webpack.js.org/concepts/)

Also add the webpack command to scripts section inside package.json:

```json
// package.json

"scripts": {
  "dev": "webpack-dev-server --mode development --progress --hot",
  "build": "webpack --mode production"
}
```

> so we can run in command line:
>
> `yarn dev` or `npm run dev` to develop,
>
> `yarn build` or `npm run build` to bundle.

## Integrate ESLint

ESLint is a linting tool for JavaScript that based on rules configurated.

The TypeScript team  decided to adopting ESLint in their repo.
See: [The future of TypeScript on ESLint](https://eslint.org/blog/2019/01/future-typescript-eslint))

### Installing ESLint

```bash
shell> yarn add --dev eslint # or npm install --save-dev eslint
```

### Add ESLint plugins

We need to add ESLint plugins which support Typescript syntax.

Install **`@typescript-eslint/eslint-plugin`** and **`@typescript-eslint/parser`** which recommended (and maintained) by the TypeScript team.

```bash
shell> yarn add --dev @typescript-eslint/eslint-plugin @typescript-eslint/parser # or npm install --save-dev @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

> The `@typescript-eslint/parser`  parse TypeScript code, `@typescript-eslint/eslint-plugin` linting rules.

### Configuring ESLint

To help configure ESLint for TypeScript, Create `.eslintrc.js` file inside the root directory and fill it:

```js
// .eslintrc.js

module.exports = {
  // Tell ESLint to use the Typescript parser instead of it’s default.
  parser: '@typescript-eslint/parser',
  parserOptions: {
  // ECMA version to 2018, would be using the latest ES features
    ecmaVersion: 2018,
    // sourceType to module, would be using ES modules
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  env: {
    // Apply browser: tell ESLint that window as global
    browser: true,
     // Apply server
    node: true,
  },
  // Wherein set the rules that the basic ESLint recommended and the typescript plugin recommends
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
    rules: {
    // note you must disable the base rule as it can report incorrect errors
    "indent": "off",
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/no-explicit-any": "off",
    "comma-dangle": [2, "always-multiline"],
    "arrow-parens": 0,
    "generator-star-spacing": 0,
    "space-before-function-paren": ["error", "never"],
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-object-literal-type-assertion": 0,
    "@typescript-eslint/prefer-interface": 0,
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    "no-console": 0,
  }
}
```

### Linting

Add a `npm script` in `package.json`

```json
// package.json

"scripts": {
  "lint": "eslint . --ext .ts,.tsx,.js,.jsx"
}
```

> We can also add a `–fix` argument as another command to make ESLint fix some of the linting errors it throws.

### Recommend installing an extension to editor/IDE

**vs code** : Add following settings for vs code

```json
// .vscode/settings.json

{
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    { "language": "typescript", "autoFix": true },
    { "language": "typescriptreact", "autoFix": true }
  ]
}
```

## Integrate React

### Installint React dependencies

Add `React` and `React-DOM` as dependencies

```bash
shell> yarn add react react-dom # or npm install react react-dom
```

### Installing declaration files for React and ReactDOM as dev dependencies

```bash
shell> yarn add --dev @types/react @types/react-dom # or npm install --save-dev @types/react @types/react-dom
```

### Installing Babel preset - `@babel/preset-react`

We need to installing `@babel/preset-react` for React to compiling JSX to Javascript:

```bash
shell> yarn add --dev @babel/preset-react # or npm install --save-dev @babel/preset-react
```

and update file `babel.config.js` inside root directory:

```js
// babel.config.js

module.exports = function (api) {
  // Cache the returned value forever and don't call this function again.
  api.cache(true)

  const presets = [
    // +
    // For compiling JSX and other stuff down to Javascript
    "@babel/preset-react",

    // Enable Babel to understand TypeScript
    "@babel/preset-typescript",

    // Allows smart transpilation according to target environments
    [ "@babel/env", {
      // Specifying the environments should transpile down to
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      },

      // Enable transformation of ES6 module syntax to another module type.
      "modules": false
    }]
  ]

  const plugins = [
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread"
  ]

  return {
    presets,
    plugins
  }
}
```

Add some source file

```bash
shell> touch ./src/index.html
shell> touch ./src/main.tsx
shell> touch ./src/App.tsx
```

```html
// src/index.html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>TypeScript React Boilerplate</title>
</head>
<body>
  <noscript>Need to enable JavaScript to run this app.</noscript>
  <div id="root" />
</body>
</html>
```

```tsx
// src/main.tsx

/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(<App />, document.getElementById('root'))
```

```tsx
// src/App.tsx

import React from 'react'

const App = (): JSX.Element => {
  return (
    <h1>Hello, World</h1>
  )
}

export default App
```

## Integrate Jest

Jest works out of the box for JavaScript projects but with TypeScript, need to do some configurations.

### Installing Jest

Installing `jest` dependencies first.

```bash
shell> yarn add --dev jest # or npm install --save-dev jest
```

>Note: **`babel-jest`** is automatically installed when installing Jest and will automatically transform files if a babel configuration exists in project.

Also add the corresponding declaration file (@types/jest) for it.

```bash
shell> yarn add --dev @types/jest # or npm install --save-dev @types/jest
```

Also need to install **`react-test-renderer`** and its types.

>React test renderer allows render React components to JavaScript objects instead of using the DOM tree. This increases the performance of test cases.

```bash
shell> yarn add --dev react-test-renderer # or npm install --save-dev react-test-renderer
shell> yarn add --dev @types/react-test-renderer # or npm install --save-dev @types/react-test-renderer
```

Installing **`ts-jest`**, ts-jest is a TypeScript preprocessor with source map support built in for Jest that lets you use Jest to test projects written in TypeScript.

```bash
shell> yarn add --dev ts-jest # or npm install --save-dev ts-jest
```

### Configuring Jest

Jest's configuration can be defined in the package.json, or through a **`jest.config.js`** file or through the --config <path/to/js|json> option.

>Create a basic configuration file in project root direcotry
>
> `shell> ./node_modules/.bin/jest --init`

```js
module.exports = {
  // A list of paths to directories that Jest should use to search for files in
  roots: [
    "<rootDir>/src"
  ],

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[tj]s?(x)"
  ],

  // Tells jest to use ts-jest for ts / tsx files.
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  }
}
```

### Making babel config jest-aware

Jest will set **`process.env.NODE_ENV`** to **'test'** if it's not set to something else.

We can read the environment variable in babel configuration to check if the current mode is test or not since jest sets that variable value when it starts execution:

```js
// babel.config.js

module.exports = api => {
  const isTest = api.env('test');
  // You can use isTest to determine what presets and plugins to use.

  return {
    // ...
  };
};
```

** In the `babel.config.js` configuration file, with the `@babel/preset-env`, we set the `modules` property to `false`. Did this because we do not transpile the `import` statements using Babel because we want using Webpack to find out which imports are being used and transpile them, thus Webpack be able to do tree shaking.

But Jest only understand the **`commonjs`** modules format, so we conditionally setup:

```js
// babel.config.js

module.exports = function (api) {
  // Testing if babel is being run in test mode
  const isTest = api.env('test');

  // Cache the returned value forever and don't call this function again.
  api.cache(true)

  const presets = [
    // For compiling JSX and other stuff down to Javascript
    "@babel/preset-react",

    // Enable Babel to understand TypeScript
    "@babel/preset-typescript",

    // Allows smart transpilation according to target environments
    [ "@babel/env", {
      // Specifying the environments should transpile down to
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      },

      // Enable transformation of ES6 module syntax to another module type.
      modules: isTest ? 'commonjs' : false,
    }]
  ]

  const plugins = [
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread"
  ]

  return {
    presets,
    plugins
  }
}
```

Now we can add unit test command to scripts section in `package.json`:

```json
// package.json

"scripts": {
  "unit": "jest",
  "coverage": "jest --coverage"
}
```
