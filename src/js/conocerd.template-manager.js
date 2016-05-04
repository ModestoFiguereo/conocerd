(function (namespace) {
  var ns = namespace('conocerd.views');
  var Template = namespace.import('conocerd.views').Template;
  var $ = namespace.import('jQuery');
  var Promise = namespace.import('Promise');

  ns.TemplateManager = (function () {
    var templates = [];

    return {
      getTemplate: function (url) {
        var template = templates.find(function (x) { return x.url === url; });

        return new Promise(function resolver(resolve, reject) {
          if (template) {
            resolve(template);
          } else {
            $.get(url).done(function (source) {
              template = new Template(url, source);

              templates.push(template);
              resolve(template);
            })
            .fail(function (err) {
              reject(err);
            });
          }
        })
        .catch(function () {
          console.log('Could not load ' + url + ' template.');
        });
      }
    };
  }());
}(window.namespace));
