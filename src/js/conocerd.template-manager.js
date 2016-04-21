(function (namespace) {
  var ns = namespace('conocerd.views');
  var Template = namespace.import('conocerd.views').Template;
  var $ = namespace.import('jQuery');

  ns.TemplateManager = (function () {
    var templates = [];

    return {
      getTemplate: function (url, callback) {
        var template = templates.find(function (x) { return x.url === url; });

        if (template) {
          callback(template);
        } else {
          $.get(url).done(function (source) {
            template = new Template(url, source);

            templates.push(template);
            callback(template);
          });
        }
      }
    };
  }());
}(window.namespace));
