// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular/cli'],
        plugins: [
            require('karma-jasmine'),
            require('karma-coverage'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage-istanbul-reporter'),
            require('karma-istanbul-threshold'),
            require('@angular/cli/plugins/karma'),
            require('karma-phantomjs-launcher')
        ],
        client: {
            clearContext: true // leave Jasmine Spec Runner output visible in browser
        },
        coverageIstanbulReporter: {
            reports: ['lcovonly', 'html', 'json'],
            fixWebpackSourcePaths: true
        },
        istanbulThresholdReporter: {
            src: 'coverage/coverage-final.json',
            reporters: ['text'],
            excludes: [],
            thresholds: {
                global: {
                    statements: 90,
                    branches: 90,
                    lines: 70,
                    functions: 90,
                },
                each: {
                    statements: 80,
                    branches: 80,
                    lines: 60,
                    functions: 80,
                },
            }
        },
        angularCli: {
            environment: 'dev'
        },
        reporters: config.angularCli && config.angularCli.codeCoverage
            ? ['progress', 'coverage-istanbul']
            : ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['Chrome'],
        singleRun: false
    });
};
