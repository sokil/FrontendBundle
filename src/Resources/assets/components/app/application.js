/**
 * Application
 */
var Application = Marionette.Application.extend({

    router: null,

    container: null,

    rootView: null,

    /**
     * Initialize application
     *
     * @param {object} options
     */
    initialize: function(options) {

        var self = this;

        // init options with default values
        options = _.extend({
            routers: [],                // array of Backbone.Router, omitted if `router` passed
            defaultRoute: null,         // default route, used with `routers` option
            serviceDefinitions: null,    // object with service definitions\]
            requireJs: null,            // requireJs configuration
            root: 'body',               // root element of SPA app
            regions: {                  // regions of root element
                content: '#content',    // region for content of app
                popup: '#popup'         // region for popup rendering
            }
        }, options);

        // set router
        if (!_.isArray(options.routers) || _.isEmpty(options.routers)) {
            throw new Error('Routes not specified');
        }

        // create router
        this.router = new Marionette.AppRouter();

        // check default route passed
        var defaultRoute = options.defaultRoute;

        // set routes
        _.each(
            options.routers,
            function(Router) {
                var router = new Router();

                this.router.processAppRoutes(router, router.routes);

                // set default route
                if (defaultRoute[0] === Router) {
                    this.router.route(
                        "",
                        "defaultRoute",
                        _.bind(
                            router[defaultRoute[1]],
                            router
                        )
                    )
                }
            },
            this
        );

        // set container definition
        var serviceDefinition = {};
        if (_.isArray(options.serviceDefinitions) && options.serviceDefinitions.length > 0) {
            for (var i in options.serviceDefinitions) {
                _.extend(serviceDefinition, options.serviceDefinitions[i]);
            }
        }
        this.container = new Container(serviceDefinition);

        // requireJs config
        var requireJsConfig = {
            baseUrl: '/bundles/',   // all dependencies will be placed in assets dir
            paths: {},
            shim: {}
        };

        if (_.isArray(options.requireJs) && options.requireJs.length > 0) {
            for (var i in options.requireJs) {
                if (options.requireJs[i].paths) {
                    _.extend(requireJsConfig.paths, options.requireJs[i].paths);
                }
                if (options.requireJs[i].shim) {
                    _.extend(requireJsConfig.shim, options.requireJs[i].shim);
                }
            }
        }

        requirejs.config(requireJsConfig);

        // configure already loaded dependencies
        define('jquery', [], function() { return jQuery; });

        // render root view
        var RootView = Marionette.LayoutView.extend({
            el: options.root,
            template: false,
            regions: options.regions
        });
        this.rootView = new RootView();
        this.rootView.render();

        // root view's content events
        this.rootView.content.on('empty', function() {
            this.$el.addClass('loading');
        });

        this.rootView.content.on('before:show', function() {
            this.$el.removeClass('loading');
        });

        // init
        this.on('start', function() {

            // start routing
            Backbone.history.start({pushState: options.pushState || false});

            // modal
            $(document).on('click', '[data-modal]', function() {
                var viewName = $(this).data('modal') + 'View';
                var view = new window[viewName]($(this).data());
                view.render();
                return false;
            });

            // handle clicks by backbone
            $(document).on('click', 'a[href^="/#"]', function() {
                var url = $(this).attr('href').substr(2);
                self.router.navigate(
                    url,
                    {trigger: true}
                );
                return false;
            });
        });
    },

    /**
     * Get translation
     *
     * @param string code
     * @returns {*}
     */
    t: function(code) {
        return i18n.getMessage(code);
    },

    /**
     * Render template
     *
     * @param string templateName
     * @param object data
     * @returns {*}
     */
    render: function(templateName, data) {
        var template = window.JST && window.JST[templateName];
        data = $.extend(data || {}, {
            t: app.t,
            app: this
        });

        return template(data);
    },

    loadCss: function (resources) {
        var loadedUrls = [];
        _.each(resources, function(url) {
            // check if already loaded
            if (-1 !== loadedUrls.indexOf(url)) {
                return;
            }
            // register as loaded
            loadedUrls.push(url);
            // load
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = url;
            document.getElementsByTagName("head")[0].appendChild(link);
        });
    },

    loadImages: function (resources, callable) {
        var resourcesInQueue = resources.length;
        _.each(resources, function(url) {
            var img = document.createElement("img");
            img.onload = function() {
                resourcesInQueue--;
                if (0 === resourcesInQueue) {
                    if (typeof callback === 'function') {
                        callable();
                    }
                }
            };
            img.src = url;
        });
    },

    /**
     * Render popup
     *
     * @param string popupView
     * @returns {AbstractApplication}
     */
    popup: function(popupView) {
        this.rootView.popup.show(popupView);
        return this;
    }
});

/**
 * Allow fetch default falues for model
 * @param options
 * @deprecated use ModelFetchDefaultsTrait
 */
Backbone.Model.prototype.fetchDefaults = function(options) {
    var self = this;

    if (this.defaults) {
        return $.Deferred()
            .resolveWith(this, this.defaults)
            .promise()
            .done(function() {
                this.trigger('syncDefaults', this, this.defaults, options);
            });
    }

    return $.get(this.urlRoot + '/new').done(function(response) {
        self.defaults = response;
        self.attributes = _.defaults({}, self.attributes, self.defaults);
        self.trigger('syncDefaults', self, response, options);
    });
};
