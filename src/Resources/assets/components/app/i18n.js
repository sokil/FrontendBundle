/**
 * Localization
 */
var i18n = {
    _messages: {},
    addMessages: function(messages) {
        this._messages = $.extend({}, this._messages, messages);
    },
    getMessage: function(code) {
        return this._messages[code] || code;
    }
};