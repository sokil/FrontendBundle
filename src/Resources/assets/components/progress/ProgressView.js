var ProgressView = Marionette.View.extend({

    minValue: 0,

    maxValue: 100,

    currentValue: 0,

    captionTemplate: null,

    initialize: function(options) {
        if (options.minValue) {
            this.minValue = options.minValue;
        }

        if (options.maxValue) {
            this.maxValue = options.maxValue;
        }

        if (options.currentValue) {
            this.currentValue = options.currentValue;
        }

        if (options.template) {
            this.captionTemplate = _.template(options.template);
        }
    },

    render: function() {
        this.$el.html(app.render('Progress', {
            currentValue: this.currentValue,
            minValue: this.minValue,
            maxValue: this.maxValue,
            caption: this.getCaption()
        }));
    },

    getCaption: function() {
        if (!this.captionTemplate) {
            return this.currentValue;
        }

        return this.captionTemplate({
            currentValue: this.currentValue,
            minValue: this.minValue,
            maxValue: this.maxValue
        });
    },

    setCurrentValue: function(value) {
        this.currentValue = value;

        // change progress element
        var $progressBar = this.$el.find('.progress-bar')
            .attr('aria-valuenow', value)
            .css({width: value + '%'});

        // change caption
        $progressBar.find('span').text(this.getCaption());

        return this;
    }
});