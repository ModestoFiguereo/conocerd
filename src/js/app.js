(function (namespace) {
  var Router = namespace.import('conocerd.route').Router;
  var TemplateManager = namespace.import('conocerd.views').TemplateManager;
  var $ = namespace.import('jQuery');
  var views = namespace.import('conocerd.views');
  var config = namespace.import('config');

  Router
    .config({ mode: 'hash' })
    .add('/', views.HomeView)
    .add('/home', views.HomeView)
    .add('/about', function () {
      console.log(this);
      TemplateManager.getTemplate('/about.html')
        .then(function (template) {
          $(config.views.VIEWS_SECTION).empty().append(template.compile({
            title: 'About',
            body: 'We\'re conocerd.com!'
          }));
        });
    })
    .add('/products/:id/', function () {
      console.log(this);
      var params = this.params;
      TemplateManager.getTemplate('/product.html')
        .then(function (template) {
          $(config.views.VIEWS_SECTION).empty().append(template.compile(params));
        });
    })
    .add('/404', function () {
      var params = this.params;
      TemplateManager.getTemplate('/404.html')
        .then(function (template) {
          $(config.views.VIEWS_SECTION).empty().append(template.compile(params));
        });
    })
    .otherwise(function () {
      this.navigate('404');
    });
}(window.namespace));
