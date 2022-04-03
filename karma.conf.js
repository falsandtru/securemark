module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      { pattern: 'https://cdn.polyfill.io/v3/polyfill.js?flags=gated&features=default', watched: false, served: false, included: true },
      { pattern: 'https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js', watched: false, served: false, included: true },
      { pattern: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/prism.js', watched: false, served: false, included: true },
      { pattern: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/plugins/autoloader/prism-autoloader.min.js', watched: false, served: false, included: true },
      { pattern: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.0/es5/tex-chtml.min.js', watched: false, served: false, included: true },
      { pattern: 'https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.2.2/purify.js', watched: false, served: false, included: true },
      { pattern: 'node_modules/power-assert/build/power-assert.js', watched: true, served: true, included: true },
      { pattern: 'dist/*.test.js', watched: true, served: true, included: true }
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
    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],
      dir: 'coverage',
      combineBrowserReports: true,
      skipFilesWithNoCoverage: false,
      verbose: false,
      'report-config': {
        html: {
          subdir: 'html',
        },
      },
      instrumentation: {
        'default-excludes': false,
      },
    },
    coverageIstanbulInstrumenter: {
      esModules: true,
    },
    autoWatch: true,
    autoWatchBatchDelay: 500,
    browserDisconnectTimeout: 30000,
    browsers: ['Chrome'],
    singleRun: true,
  });
};
