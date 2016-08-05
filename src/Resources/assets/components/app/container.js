var Container = function(definitions) {
    this.add(definitions);
};

Container.prototype = {
    prepared: {},

    resolved: {},

    add: function(definitions) {
        for (var serviceId in definitions) {
            this.set(serviceId, definitions[serviceId]);
        }
    },

    set: function(serviceId, callable) {
        if (!serviceId) {
            throw Error('Service identifier not specified');
        }

        if (typeof callable !== 'function') {
            throw Error('Callable not specified');
        }

        this.prepared[serviceId] = callable;
    },

    get: function(serviceId) {
        if (!serviceId) {
            throw Error('Service identifier not specified');
        }

        if (this.resolved[serviceId]) {
            return this.resolved[serviceId];
        }

        if (!this.prepared[serviceId]) {
            throw Error('Service "' + serviceId + '" not specified');
        }

        this.resolved[serviceId] = this.prepared[serviceId].call(this);
        delete this.prepared[serviceId];

        return this.resolved[serviceId];
    },

    buildFetchablePromise: function(fetchable) {
        var $deferred = $.Deferred(),
            self = this;

        fetchable
            .fetch()
            .done(function() {
                $deferred.resolveWith(self, [fetchable]);
            })
            .fail(function() {
                $deferred.rejectWith(self, [fetchable]);
            });

        return $deferred.promise();
    }
};