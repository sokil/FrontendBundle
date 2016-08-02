var ButtonGroupView = Backbone.View.extend({

    events: {
        'click [data-value]': function(e) {
            var value = $(e.currentTarget).data('value');
            this.clickEventHandler.call(this, value);
        }
    },

    buttons: {},

    click: null,

    buttonClass: 'btn-default',

    className: 'btn-group',

    initialize: function(options) {
        if (options.buttons) {
            this.setButtons(options.buttons);
        }

        if (options.buttonClass) {
            this.buttonClass = options.buttonClass;
        }

        this.clickEventHandler = options.click;
    },

    setButtons: function(buttons) {
        this.buttons = {};
        for(var buttonName in buttons) {
            this.setButton(buttonName, buttons[buttonName]);
        }

        return this;
    },

    setButton: function(name, metadata) {
        this.buttons[name] = metadata;
        return this;
    },

    render: function() {
        this.$el.html(app.render('ButtonGroup', {
            buttons: this.buttons,
            buttonClass: this.buttonClass
        }));
    }
});