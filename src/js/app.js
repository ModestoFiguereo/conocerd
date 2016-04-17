(function (namespace, jQuery) {
  var Router = namespace.import('conocerd.route').Router;
  var TemplateManager = namespace.import('conocerd.views').TemplateManager;

  Router
    .config({ mode: 'hash' })
    .add('/', function () {
      console.log('default');
    })
    .add('/about', function () {
      console.log(this);
      TemplateManager.getTemplate('/about.html', function (template) {
        jQuery('body').html(template.compile({
          title: 'About',
          body: 'We\'re conocerd.com!'
        }));
      });
    })
    .add('/products/:id/', function () {
      console.log(this);
      var params = this.params;
      TemplateManager.getTemplate('/product.html', function (template) {
        jQuery('body').html(template.compile(params));
      });
    })
    .add('/404', function () {
      var params = this.params;
      TemplateManager.getTemplate('/404.html', function (template) {
        jQuery('body').html(template.compile(params));
      });
    })
    .otherwise(function () {
      this.navigate('404');
    });
}(window.namespace, window.$));
