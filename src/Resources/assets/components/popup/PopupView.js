var PopupView = Marionette.LayoutView.extend({
    title: null,

    buttons: [],

    dialogClass: null,

    regions: {
        body: '.modal-body'
    },

    view: null,

    options: {
        destroyImmediate: true
    },

    isRendered: false,

    initialize: function(options) {
        if (options.title) {
            this.title = options.title;
        }

        if (options.body) {
            this.setBody(options.body);
        }

        if (options.buttons) {
            this.buttons = options.buttons;
        }

        if (options.dialogClass) {
            this.dialogClass = options.dialogClass;
        }

        this.init(options);
    },

    init: function() {},

    /**
     * May be used only before render
     *
     * @param body instanceof Backbone.View or HTML string
     * @returns {PopupView}
     */
    setBody: function(body) {
        if (body instanceof Backbone.View) {
            this.view = body;
        } else {
            var BodyView = Backbone.View.extend({
                render: function() {
                    this.$el.html(body);
                    return this;
                }
            });
            this.view = new BodyView();
        }

        if (this.isRendered) {
            this.body.show(this.view);
        }

        return this;
    },

    render: function() {
        var self = this;

        // render popup
        var popupHtml = app.render('Popup', {
            title: this.title,
            buttons: this.buttons,
            dialogClass: this.dialogClass
        });

        this.$el.html(popupHtml);

        // init bootstrap modal
        this.$el
            .find('.modal')
            .on('hidden.bs.modal', function() {
                self.destroy();
            })
            .modal({});

        // render body
        if (this.view) {
            this.body.show(this.view);
        }

        this.isRendered = true;
    },

    show: function() {
        this.$el.find('.modal').modal('show');
        return this;
    },

    remove: function() {
        this.$el.find('.modal').modal('hide');
        return this;
    }
});