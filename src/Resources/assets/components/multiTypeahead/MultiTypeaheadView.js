var MultiTypeaheadView = Marionette.LayoutView.extend({

    regions: {
        list: '[data-list]'
    },

    /**
     *
     */
    initialize: function(params) {
        // init typeahead
        if (params.typeahead) {
            this.typeahead = params.typeahead;
        }

        // init list
        this.listView = new ListView(params.list || {});
    },

    /**
     *
     */
    render: function() {
        var self = this;

        // render container
        this.$el.html(app.render('MultiTypeahead', {

        }));

        app.loadCss([
            '/bundles/frontend/css/typeahead.css'
        ]);

        // init typeahead
        require(
            ['typeahead', 'bloodhound'],
            function() {
                // prepare data source
                var bloodhoundParams = {
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    datumTokenizer: function (datum) {
                        var value = self.listView.modelValue(new Backbone.Model(datum));
                        return Bloodhound.tokenizers.whitespace(value);
                    },
                    identify: function (datum) {
                        return self.listView.modelId(new Backbone.Model(datum));
                    }
                };

                // remote data source
                if (self.typeahead.remote) {
                    bloodhoundParams.remote = _.extend({
                        url: _.result(self.listView.collection, 'url'),
                        wildcard: '*',
                        transform: function (response) {
                            return response.list;
                        }
                    }, self.typeahead.remote);
                }

                // local data source
                if (self.typeahead.local) {
                    bloodhoundParams.local = self.typeahead.local;
                }

                // prefetch data source
                if (self.typeahead.prefetch) {
                    bloodhoundParams.prefetch = _.extend({
                        url: _.result(self.listView.collection, 'url')
                    }, self.typeahead.prefetch);
                }

                // init typeahead
                this.$('[data-typeahead]')
                    .typeahead(
                        null,
                        {
                            source: new Bloodhound(bloodhoundParams),
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