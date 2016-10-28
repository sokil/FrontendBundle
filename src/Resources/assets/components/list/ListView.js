var ListView = Backbone.View.extend({

    CHECK_TYPE_CHECKBOX: 'checkbox',
    CHECK_TYPE_RADIO: 'radio',

    /**
     * Collection of options
     */
    collection: new Backbone.Collection(),

    /**
     * Type of check. If specified may be 'checkbox' or 'radio'
     */
    checkType: null,

    /**
     * Callable to convert model to checked
     *
     * @param model
     */
    modelChecked: function(model) {
        return model.get('checked') === true;
    },

    /**
     * Callable to convert model to value
     *
     * @param model
     */
    modelValue: function(model) {
        return model.get('value');
    },

    /**
     * Callable to convert model to id
     *
     * @param model
     */
    modelId: function(model) {
        return model.id;
    },

    /**
     * Name of check input
     */
    name: null,

    /**
     * Buttons
     */
    buttons: [],

    /**
     * Template of list
     */
    template: 'List',

    /**
     * Constructor
     * @param {object} params
     */
    initialize: function(params) {
        // check if collection valid
        if (params.collection instanceof Backbone.Collection) {
            this.collection = params.collection;
        }

        // check if checkType valid
        if (_.indexOf([this.CHECK_TYPE_CHECKBOX, this.CHECK_TYPE_RADIO], params.checkType)) {
            this.checkType = params.checkType;

            this.name = params.name || ('list' + parseInt(Math.random() * 1000000));

        }

        // define model to list item converters
        if (typeof params.modelChecked === 'function') {
            this.modelChecked = params.modelChecked;
        }

        if (typeof params.modelValue === 'function') {
            this.modelValue = params.modelValue;
        }

        if (typeof params.modelId === 'function') {
            this.modelId = params.modelId;
        }

        // buttons
        if (_.isArray(params.buttons) && params.buttons.length > 0) {
            this.buttons = _.map(
                function(button) {
                    button = _.extend({
                        name: null,     // required. name to unique identify button
                        class: null,    // optional. class of button. used as identifier if name not specified
                        icon: null,     // optional. icon of button.
                        caption: null,  // required. caption of button
                        click: null     // required. click handler
                    }, button);

                    if (typeof button.click === 'function') {
                        var classArray = _.isArray(button.class)
                            ? button.class
                            : button.class.split(' ');

                        var selector = params.name
                            ? '[data-' + params.name + ']'
                            : '.' + classArray.join('.');

                        this.delegate(
                            'click',
                            selector,
                            button.click
                        );
                    }

                    return button;
                },
                params.buttons,
                this
            );
        }

        // template
        if (params.template) {
            this.template = params.template;
        }

        // on collection change re-render list
        this.listenTo(params.collection, 'change', this.render);
    },

    render: function() {
        this.$el.html(app.render(
            this.template,
            {
                list: this.collection.map(function(model) {
                    return {
                        id: this.modelId(model),
                        value: this.modelValue(model),
                        checked: this.modelChecked(model)
                    };
                }.bind(this)),
                checkType: this.checkType,
                name: this.name,
                buttons: this.buttons
            }
        ));
    },

    /**
     * Add element to collection
     *
     * @param {Backbone.Model} model
     * @returns {ListView}
     */
    add: function(model) {
        this.collection.add(model);
        return this;
    },

    /**
     * Get collection
     *
     * @returns {*}
     */
    getCollection: function() {
        return this.collection;
    }
});