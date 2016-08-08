module.exports = function (grunt) {
    'use strict';

    var env = grunt.option('env') || 'prod';
    grunt.config('env', env);
    console.log('Environment: ' + env);

    grunt.initConfig({
        jshint: {
            files: [],
            options: {
                loopfunc: true,
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
        },
        jade: {
            components: {
                options: {
                    client: true,
                    debug: grunt.config('env') !== 'prod',
                    compileDebug: grunt.config('env') !== 'prod',
                    processName: function(filename) {
                        var path = require('path');
                        return path.basename(filename, '.jade');
                    }
                },
                files: {
                    "Resources/public/js/components.jade.js": [
                        "Resources/assets/components/pagination/*.jade",
                        "Resources/assets/components/progress/*.jade",
                        "Resources/assets/components/popup/*.jade",
                        "Resources/assets/components/buttonGroup/*.jade"
                    ]
                }
            }
        },
        less: {
            theme: {
                files: {
                    "Resources/public/css/theme.css": [
                        "Resources/assets/css/mixin.less",
                        "Resources/assets/css/bootstrap.theme.less",
                        "Resources/assets/css/site.theme.less"
                    ]
                }
            }
        },
        cssmin: {
            vendors: {
                files: {
                    'Resources/public/css/vendor.css': [
                        'bower_components/bootstrap/dist/css/bootstrap.min.css'
                    ]
                }
            }
        },
        uglify: {
            vendors: {
                options: {
                    compress: grunt.config('env') === 'prod',
                    beautify: grunt.config('env') !== 'prod',
                    mangle: grunt.config('env') === 'prod'
                },
                files: {
                    'Resources/public/js/vendor.js': [
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/underscore/underscore.js',
                        'bower_components/backbone/backbone.js',
                        'bower_components/marionette/lib/backbone.marionette.js',
                        "node_modules/jade/runtime.js"
                    ]
                }
            },
            ie: {
                files: {
                    'Resources/public/js/ie.js': [
                        'bower_components/respond/dest/respond.src.js',
                        'bower_components/html5shiv/dist/html5shiv.js'
                    ]
                }
            }
        },
        watch: {
            project: {
                files: [
                    'Resources/assets/**/*'
                ],
                tasks: ['build'],
                options: {},
            }
        },
        copy: {
            fonts: {
                expand: true,
                flatten: true,
                src: [
                    'bower_components/bootstrap/dist/fonts/*'
                ],
                dest: '../../../web/fonts/'
            },
            images: {
                expand: true,
                flatten: true,
                src: [
                    'Resources/assets/images/*'
                ],
                dest: 'Resources/public/images/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-pug');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', [
        'newer:jade',
        'newer:less',
        'newer:cssmin',
        'newer:uglify',
        'copy'
    ]);

    grunt.registerTask('listen', [
        'watch'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};