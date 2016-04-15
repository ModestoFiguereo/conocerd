(function (jQuery) {
  this.conocerd = this.conocerd || {};

  var Router = this.conocerd.route.Router;
  var TemplateManager = this.conocerd.views.TemplateManager;
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
    });
}(window.$));
