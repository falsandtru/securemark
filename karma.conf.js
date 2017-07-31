module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      { pattern: 'https://cdn.polyfill.io/v2/polyfill.js?features=default,String.prototype.repeat,IntersectionObserver&flags=gated', watched: false, served: false, included: true },
      { pattern: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_CHTML,Safe', watched: false, served: false, included: true },
      { pattern: 'https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js', watched: false, served: false, included: true },
      { pattern: 'node_modules/power-assert/build/power-assert.js', watched: true, served: true, included: true },
      { pattern: 'dist/*.js', watched: true, served: true, included: true }
    ],
    exclude: [
    ],
    espowerPreprocessor: {
      options: {
        emitActualCode: false,
        ignoreUpstreamSourceMap: true
      }
    },
    reporters: ['dots'],
    coverageReporter: {
      dir: 'coverage',
      subdir: function (browser, platform) {
        return browser.toLowerCase().split(' ')[0];
      },
      reporters: [
        { type: 'lcov' },
        { type: 'text-summary', subdir: '.', file: 'summary.txt' }
      ]
    },
    autoWatch: true,
    autoWatchBatchDelay: 500,
    browsers: ['Chrome'],
    browserNoActivityTimeout: 100 * 1e3,
    client: {
      useIframe: false
    }
  });
};
