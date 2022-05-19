module.exports = function (config) {
  config.set({
    browsers: ['Chrome', 'Firefox'],
    frameworks: ['mocha', 'power-assert'],
    files: [
      { pattern: 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.js', watched: false, served: false, included: true, integrity: 'sha512-2iwCHjuj+PmdCyvb88rMOch0UcKQxVHi/gsAml1fN3eg82IDaO/cdzzeXX4iF2VzIIes7pODE1/G0ts3QBwslA==' },
      { pattern: 'https://cdnjs.cloudflare.com/ajax/libs/benchmark/2.1.4/benchmark.js', watched: false, served: false, included: true, integrity: 'sha512-XnVGk21Ij51MbU8XezQpkwZ1/GA8b5qmoVGIOdJLBYycutjkaeemipzRJP7P6mEJl99OfnweA7M3e4WLfuG7Aw==' },
      { pattern: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.js', watched: false, served: false, included: true, integrity: 'sha512-n/4gHW3atM3QqRcbCn6ewmpxcLAHGaDjpEBu4xZd47N0W2oQ+6q7oc3PXstrJYXcbNU1OHdQ1T7pAP+gi5Yu8g==' },
      { pattern: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/prism.min.js', watched: false, served: false, included: true, integrity: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.22.0/prism.js' },
      { pattern: 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.28.0/plugins/autoloader/prism-autoloader.min.js', watched: false, served: false, included: true, integrity: 'sha512-fTl/qcO1VgvKtOMApX2PdZzkziyr2stM65GYPLGuYMnuMm1z2JLJG6XVU7C/mR+E7xBUqCivykuhlzfqxXBXbg==' },
      { pattern: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.0/es5/tex-chtml.min.js', watched: false, served: false, included: true, integrity: 'sha512-93xLZnNMlYI6xaQPf/cSdXoBZ23DThX7VehiGJJXB76HTTalQKPC5CIHuFX8dlQ5yzt6baBQRJ4sDXhzpojRJA==' },
      { pattern: 'https://cdnjs.cloudflare.com/ajax/libs/dompurify/2.3.8/purify.js', watched: false, served: false, included: true, integrity: 'sha512-QaF+0tDlqVmwZaQSc0kImgYmw+Cd66TxA5D9X70I5V9BNSqk6yBTbyqw2VEUsVYV5OTbxw8HD9d45on1wvYv7g==' },
      { pattern: 'dist/**/*.{js,map}', watched: true, served: true, included: true },
    ],
    reporters: ['dots', 'coverage'],
    preprocessors: {
      'dist/**/*.js': ['coverage'],
    },
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: browser => browser.split(/\s/)[0] },
        { type: 'text-summary', subdir: '.', file: 'summary.txt' },
      ],
    },
    browserDisconnectTimeout: 60 * 1e3,
    browserNoActivityTimeout: 90 * 1e3,
  });
};
