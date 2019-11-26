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