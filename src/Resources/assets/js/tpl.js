var tpl = {
    render: function(templateName, data) {
        var template = window.JST && window.JST[templateName];
        if (!template) {
            throw Error('Template ' + templateName + ' not found');
        }

        data = _.extend({}, (data || {}), {
            t: i18n.getMessage.bind(i18n)
        });

        return template(data);
    }
};