// RequireJs
requirejs.config({
    baseUrl: '/bundles/',
    paths: {
        tinymce: 'frontent/js/tinymce/tinymce.min',
    },
    shim: {
        'tinymce': {
            exports: 'tinymce'
        }
    }
});

// configure already loaded dependencies
define('jquery', [], function() { return jQuery; });