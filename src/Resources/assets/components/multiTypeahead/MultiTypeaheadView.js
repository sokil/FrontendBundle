var MultiTypeaheadView = Marionette.LayoutView.extend({

    regions: {
        list: '[data-list]'
    },

    /**
     *
     */
    initialize: function(params) {
        // init list
        this.listView = new ListView(params);
        // init remote data source
        if (params.remoteDataSource) {
            this.remoteDataSource = params.remoteDataSource;
        }
    },

    /**
     *
     */
    render: function() {
        var self = this;

        // render container
        this.$el.html(app.render('MultiTypeahead', {

        }));

        // init typeahead
        require(
            ['typeahead', 'bloodhound'],
            function() {
                // prepare data source
                var source = new Bloodhound({
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    datumTokenizer: function (datum) {
                        var value = self.listView.modelValue(new Backbone.Model(datum));
                        return Bloodhound.tokenizers.whitespace(value);
                    },
                    identify: function (datum) {
                        return self.listView.modelId(new Backbone.Model(datum));
                    },
                    remote: _.extend({
                        url: null,
                        wildcard: '*',
                        transform: function (response) {
                            return response.list;
                        }
                    }, self.remoteDataSource)
                });

                // init typeahead
                this.$('[data-typeahead]')
                    .typeahead(
                        null,
                        {
                            source: source,
                            display: function(datum) {
                                return self.listView.modelValue(new Backbone.Model(datum));
                            },
                            templates: {
                                notFound: '<span class="empty">' + app.t('multiTypeahead.typeahead.notFound') + '</span>',
                                suggestion: _.template('<div><%= name %></div>')
                            }
                        }
                    )
                    .bind('typeahead:selected', function (e, datum) {
                        self.listView.add(new Backbone.Model(datum));
                    });
            }
        );

        // fill list
        this.list.show(this.listView);
    }
});