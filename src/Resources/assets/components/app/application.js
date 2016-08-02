/**
 * Application
 */
var AbstractApplication = Marionette.Application.extend({

    router: null,

    container: null,

    rootView: null,

    regions: {
        content: '#content',
        popup: '#popup'
    },

    /**
     * Initialize application
     *
     * @param object options
     */
    initialize: function(options) {

        var self = this;

        // set router
        if (options.router instanceof Backbone.Router) {
            this.router = options.router;
        } else {
            throw new Error('Wrong router configured');
        }

        // set container definition
        if (options.container) {
            if (options.container instanceof Container) {
                this.container = options.container;
            } else {
                throw new Error('Wrong container configured');
            }
        }

        // configure already loaded dependencies
        define('jquery', [], function() { return jQuery; });

        // init root view
        var RootView = Marionette.LayoutView.extend({
            el: 'body',
            template: false,
            regions: options.regions || this.regions,
        });

        // render root view
        this.rootView = new RootView();
        this.rootView.render();

        // root view's content events
        this.rootView.content.on('empty', function() {
            $('#content').addClass('loading');
        });

        this.rootView.content.on('before:show', function() {
            $('#content').removeClass('loading');
        });

        // init
        this.on('start', function() {

            // moment
            // moment().locale('uk');

            // start routing
            Backbone.history.start({pushState: false});

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
        Task.prototype.defaults = response;
        self.defaults = response;
        self.attributes = _.defaults({}, self.attributes, self.defaults);
        self.trigger('syncDefaults', self, response, options);
    });
};