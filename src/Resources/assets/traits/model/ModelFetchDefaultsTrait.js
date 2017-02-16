/**
 * Backbone.Model trait allows to fetch defaults
 * @type {object}
 */
var ModelFetchDefaultsTrait = {
    __defaultsFetched: false,

    fetchDefaults: function(options) {
        var self = this;

        options = options || {};

        if (this.defaults && !this.__defaultsFetched) {
            return $.Deferred()
                .resolveWith(this, this.defaults)
                .promise()
                .done(function() {
                    this.trigger('syncDefaults', this, this.defaults, options);
                });
        }

        return $.get(
            this.urlRoot + '/new',
            options.data || {},
            function(response) {
                self.defaults = self.parse(response, {});
                self.attributes = _.defaults(
                    {},
                    self.attributes,
                    self.defaults
                );
                self.trigger('syncDefaults', self, response, options);
                self.__defaultsFetched = true;
            }
        );
    },

    fetch: function(options) {
        if (this.isNew()) {
            return this.fetchDefaults(options);
        } else {
            return Backbone.Model.prototype.fetch.call(this, options);
        }
    }
};