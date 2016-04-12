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
        jQuery('body').html(template.html);
        console.log('about');
      });
    })
    .add('/products/:id/edit/:value', function () {
      console.log('products', this.routeParams);
    })
    .listen();

  // returning the user to the initial state
  Router.navigate(Router.getFragment());
}(window.$));
