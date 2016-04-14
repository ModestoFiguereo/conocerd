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
      TemplateManager.getTemplate('/about.html', function (template) {
        jQuery('body').html(template.compile({
          title: 'About',
          body: 'We\'re conocerd.com!'
        }));
      });
    })
    .add('/products/:id/', function () {
      var params = this.routeParams;
      TemplateManager.getTemplate('/product.html', function (template) {
        jQuery('body').html(template.compile(params));
      });
    })
    .listen();

  // returning the user to the initial state
  Router.navigate(Router.getCurrentPath());
}(window.$));
