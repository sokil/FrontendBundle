/**
 * Backbone.View trait
 */
var AbstractFormViewTrait = {

    /**
     * List of element selectors
     */
    elementSelector: {
        status: '[data-status]'
    },

    /**
     * Show error status
     * @param {string} text
     * @param {string} className
     */
    showStatus: function(text, className) {
        className = className || 'info';
        this.$(this.elementSelector.status).append(
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
        this.$(this.elementSelector.status).empty();
    }
};