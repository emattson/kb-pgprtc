module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-browserify');


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        express: {
            options: {
                // Override defaults here
            },
            dev: {
                options: {
                    script: 'bin/www',
                    port:3000
                }
            }
        },
        browserify: {
            main: {
                browserifyOptions: {
                    debug: true
                },
                src: 'js/main.js',
                dest: 'public/javascripts/main.js'
            }
        },
        watch: {
            js: {
                files: 'js/*.js',
                tasks: ['default']
            },
            server: {
                files: ['app.js', 'bin/www', 'routes/*.js'],
                tasks: ['reload']
            },
            jade: {
                files: '**/*.jade',
                tasks: ['reload']
            }
        }
    });

    grunt.registerTask('reload', ['express:dev', 'watch']);
    grunt.registerTask('default', ['browserify', 'reload']);

};