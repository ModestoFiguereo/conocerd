(function (namespace, jQuery) {
  var ns = namespace('conocerd.views');
  var Template = namespace.import('conocerd.views').Template;

  ns.TemplateManager = (function () {
    var templates = [];

    return {
      getTemplate: function (url, callback) {
        var template = templates.find(function (x) { return x.url === url; });

        if (template) {
          callback(template);
        } else {
          jQuery.get(url).done(function (source) {
            template = new Template(url, source);

            templates.push(template);
            callback(template);
          });
        }
      }
    };
  }());
}(window.namespace, window.$));
