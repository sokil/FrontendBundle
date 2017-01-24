/**
 * Backbone.View trait
 */
var FormViewTrait = {

    /**
     * List of element selectors
     */
    statusElementSelector: '[data-status]',

    /**
     * Show error status
     * @param {string} text
     * @param {string} className
     */
    showStatus: function(text, className) {
        className = className || 'info';
        this.$(this.statusElementSelector).append(
            $('<div>')
                .addClass('alert alert-' + className)
                .text(text)
        );
    },

    /**
     * Show status
     * @param {string} text
     */
    showErrorStatus: function(text) {
        this.showStatus(text, 'danger');
    },

    /**
     * Hide status
     */
    hideStatus: function() {
        this.$(this.statusElementSelector).empty();
    }
};