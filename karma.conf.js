module.exports = function (config) {
    config.set({
        frameworks: ['jasmine', 'karma-typescript'],
        basePath: '',
        files: ['src/**/*.ts', 'test/**/*.ts'],
        preprocessors: {
            'src/**/*.js': ['coverage'],
            'src/**/*.ts': ['karma-typescript', 'coverage'],
            'test/**/*.ts': ['karma-typescript']
        },
        exclude: /node_modules/ ,
        karmaTypescriptConfig: {
            tsconfig: './tsconfig.json',
            include: ['test/**/*.ts', 'src/**/*.ts']
        },

        // optionally, configure the reporter
        coverageReporter: {
            dir: 'coverage/',
            reporters: [
                // reporters not supporting the `file` property
                { type: 'html', subdir: 'report-html' },
                { type: 'lcov', subdir: 'report-lcov' },
                // reporters supporting the `file` property, use `subdir` to directly
                // output them in the `dir` directory
                { type: 'cobertura', subdir: '.', file: 'cobertura.txt' },
                { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
                { type: 'teamcity', subdir: '.', file: 'teamcity.txt' },
                { type: 'text', subdir: '.', file: 'text.txt' },
                { type: 'text-summary', subdir: '.', file: 'text-summary.txt' }
            ]
        },

        reporters: ['dots', 'coverage', 'karma-typescript'],
        browsers: ['ChromeHeadless'],
        singleRun: true
    })
}
