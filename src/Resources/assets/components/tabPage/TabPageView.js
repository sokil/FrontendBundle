var TabPageView = Marionette.LayoutView.extend({

    events: {},

    tabs: {},

    initialize: function(params) {
        // configure tabs
        this.tabs = params.tabs || this.tabs;
        if (typeof this.tabs === 'function') {
            this.tabs = this.tabs.call(this);
        }

        // prepare tabs config
        _.each(this.tabs, function(tabConfig, tabName) {
            // set tab pane id
            tabConfig.tabPaneId = tabName + 'TabPane';
        });
    },

    render: function() {
        // render tabs
        this.$el.html(app.render('TabPage', {
            tabs: this.tabs
        }));

        // render view inside tabs
        _.each(
            this.tabs,
            function(tabConfig, tabName) {
                // init tab pane
                this.initTab.call(this, tabName, tabConfig);
            },
            this
        );

        // init active tab
        var initialTabName = _.keys(this.tabs)[0];
        var initialTabPaneId = '#' + this.tabs[initialTabName].tabPaneId;
        this.$el.find('[data-target="' + initialTabPaneId + '"]').tab('show');
        this.$el.find(initialTabPaneId).addClass('active');
    },

    /**
     * Initialise event handlers for specified tab
     *
     * @param tabName
     * @param tabConfig
     */
    initTab: function(tabName, tabConfig) {
        // add show event handler
        this.delegate(
            'show.bs.tab',
            '[data-target="#' + tabConfig.tabPaneId + '"]',
            function(e) {
                // trigger show event
                this.trigger('showTab showTab:' + tabName);

                // load data when first click on tab
                var $tab = $(e.target);
                if ($tab.data('loaded')) {
                    return;
                }
                $tab.data('loaded', true);

                // init tab view
                var TabPaneView = tabConfig.view;
                delete tabConfig.view;

                this.addRegion(tabName, '#' + tabConfig.tabPaneId);
                this[tabName].show(new TabPaneView(tabConfig));
            }.bind(this)
        );
    }
});