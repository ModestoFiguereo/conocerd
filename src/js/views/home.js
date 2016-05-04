(function (namespace) {
  var ns = namespace('conocerd.views');
  var TemplateManager = namespace.import('conocerd.views').TemplateManager;
  var $ = namespace.import('$');
  var config = namespace.import('config');

  ns.HomeView = (function () {
    var whenHomeTemplateLoaed = TemplateManager.getTemplate('/home.html');

    return function HomeView() {
      whenHomeTemplateLoaed.then(function (template) {
        var html = template.compile();
        $(config.views.VIEWS_SECTION)
          .empty()
          .append(html);
      });
    };
  }());
}(window.namespace));
