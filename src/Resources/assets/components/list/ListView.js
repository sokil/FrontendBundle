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
     * Name of check input
     */
    checkName: null,

    /**
     * Callable to convert model to checked
     *
     * @param model
     */
    itemChecked: function(model) {
        return model.get('checked') === true;
    },

    /**
     * Is header visible
     */
    showColumnHeader: false,

    /**
     * List schema
     */
    columns: [],

    /**
     * Buttons
     */
    buttons: [],

    /**
     * Template of list
     */
    template: 'ListTable',

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

            this.checkName = params.checkName || ('list' + parseInt(Math.random() * 1000000));

        }

        // define model to list item converters
        if (typeof params.itemChecked === 'function') {
            this.itemChecked = params.itemChecked;
        }

        // is header visible
        if (params.showColumnHeader) {
            this.showColumnHeader = params.showColumnHeader;
        }

        // columns
        if (params.columns) {
            this.columns = params.columns;
        }

        if (typeof this.columns === 'function') {
            this.columns = this.columns.call(this);
        }

        if (!_.isArray(this.columns) || this.columns === 0) {
            throw Error('Columns must be specified');
        }

        // buttons
        if (typeof this.buttons === 'function') {
            this.buttons = this.buttons.call(this);
        }

        if (_.isArray(this.buttons) && this.buttons.length > 0) {
            this.buttons = _.map(
                this.buttons,
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

                        var self = this;
                        this.delegate(
                            'click',
                            selector,
                            function(e) {
                                return button.click.call(this, e, self);
                            }
                        );
                    }

                    return button;
                },
                this
            );
        }

        // template
        if (params.template) {
            this.template = params.template;
        }

        // on collection change re-render list
        this.listenTo(this.collection, 'update', this.renderAsync);

        // fetch collection if it empty
        if (this.collection.models.length === 0) {
            this.collection.fetch();
        }
    },

    mapModelToItem: function(model) {
        // columns
        var item = _.reduce(
            this.columns,
            function(item, column, index, list) {
                if (!column.name) {
                    throw Error('Column name not specified');
                }

                var columnValue;
                if (column.value) {
                    if (typeof column.value === 'function') {
                        columnValue = column.value(model);
                    } else {
                        columnValue = column.value;
                    }
                } else {
                    columnValue = model.get(column.name);
                }
                item[column.name] = columnValue;
                return item;
            },
            {},
            this
        );

        // item id
        item['id'] = model.id;

        // item checked
        if (this.checkType) {
            item['checked'] = this.itemChecked(model);
        }

        return item;
    },

    renderAsync: function() {
        this.$el.html(app.render(
            this.template,
            {
                // list structure
                columns: this.columns,
                showColumnHeader: this.showColumnHeader,
                // collection
                collection: this.collection.map(this.mapModelToItem.bind(this)),
                // check
                checkType: this.checkType,
                checkName: this.checkName,
                // buttons
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
     * Remove models from collection
     *
     * @param models
     * @returns {ListView}
     */
    remove: function(models) {
        this.collection.remove(models);
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