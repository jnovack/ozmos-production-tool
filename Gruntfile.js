module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nodemon: {
            dev: {
                script: 'app.js',
                options: {
                    ignore: ['node_modules/**', 'modules/webserver/public/**'],
                    ext: 'js',
                    watch: ['app.js', 'modules/**', ],
                    env: {
                        NODE_ENV: 'dev'
                    },
                    nodeArgs: ['--debug'],
                    cwd: __dirname,
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });
                    },
                }
            }
        },
        watch: {
            files: ['*.js', '**/*.js', '!node_modules/**', '!.git/**', '!modules/webserver/public/**'],
            tasks: ['jshint']
        },
        jshint: {
            all: ['**/*.js', '**/*.json', '!node_modules/**', '!modules/webserver/public/**'],
            options: {
                ignore: ['node_modules/**', 'modules/webserver/public/**']
            }
        },
        concurrent: {
            options: {
                "logConcurrentOutput": true
            },
            dev: {
                tasks: ['nodemon', 'watch']
            },
            debug: {
                tasks: ['nodemon', 'watch']
            }
        },
        simplemocha: {
            options: {
                globals: [], // Add whitelisted globals here
                timeout: 3000,
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'spec'
            },
            all: { src: ['test/**/*.js'] }
        }
    });

    // Load plugins/tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-simple-mocha');

    // Grunt task(s).
    grunt.registerTask('default', ['concurrent:dev']);
    grunt.registerTask('test', ['simplemocha']);
};