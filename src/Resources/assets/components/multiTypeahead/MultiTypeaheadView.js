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
                    datumTokenizer: self.typeahead.datumTokenizer || Bloodhound.tokenizers.whitespace,
                    identify: function (datum) {
                        var model = self.listView.collection.model;
                        return (new model(datum)).id;
                    }
                };

                // remote data source
                if (self.typeahead.remote) {
                    bloodhoundParams.remote = _.extend({
                        url: null,
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
                        url: null
                    }, self.typeahead.prefetch);
                }

                // init typeahead
                this.$('[data-typeahead]')
                    .typeahead(
                        null,
                        {
                            source: new Bloodhound(bloodhoundParams),
                            display: self.typeahead.display,
                            templates: {
                                notFound: '<span class="empty">' + app.t('multiTypeahead.typeahead.notFound') + '</span>',
                                suggestion: self.typeahead.templates.suggestion
                            }
                        }
                    )
                    .bind('typeahead:selected', function (e, datum) {
                        // add item to list
                        var model = new self.listView.collection.model(datum);
                        self.listView.add(model);
                        // add select handler
                        if (typeof self.typeahead.onSelect === 'function') {
                            self.typeahead.onSelect.call(self, model);
                        }
                    });
            }
        );

        // fill list
        this.list.show(this.listView);
    }
});