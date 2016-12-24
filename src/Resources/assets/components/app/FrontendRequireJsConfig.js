var FrontendRequireJsConfig = {
    paths: {
        'typeahead': 'frontend/js/typeahead/typeahead.jquery.min',
        'bloodhound': 'frontend/js/typeahead/bloodhound.min'
    },
    shim: {
        'typeahead': {
            deps: ['jquery'],
            init: function ($) {
                return require.s.contexts._.registry['typeahead.js'].factory( $ );
            }
        },
        'bloodhound': {
            deps: ['jquery'],
            exports: 'Bloodhound'
        }
    }
};