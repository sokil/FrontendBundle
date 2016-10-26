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
     * Callable to convert model list item with known structure
     * Param 'checked': by default checks if model has 'checked' param set to true.
     * Param 'value: by default get 'value' param of model
     *
     * @param model
     */
    convertModelToListItem: function(model) {
        return {
            checked: model.get('checked') === true,
            value: model.get('value'),
            id: model.id
        }
    },

    /**
     *
     * @param model
     * @returns {*}
     */
    modelToValue: function(model) {
        return model.get('value');
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

        // define model to list item converter
        if (typeof params.convertModelToListItem === 'function') {
            this.convertModelToListItem = params.convertModelToListItem;
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
                list: this.collection.map(this.convertModelToListItem.bind(this)),
                checkType: this.checkType,
                name: this.name,
                buttons: this.buttons
            }
        ));
    }
});