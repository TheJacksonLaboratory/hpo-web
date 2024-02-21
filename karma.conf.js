// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-phantomjs-launcher'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: true // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'), reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },

    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m'
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_ERROR,
    autoWatch: false,
    browsers: ['ChromeHeadless'],
    singleRun: true,
    files: [
      {
        pattern: './node_modules/@angular/material/prebuilt-themes/indigo-pink.css'
      }
    ]
  });
};
