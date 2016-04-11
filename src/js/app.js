(function () {
  this.conocerd = this.conocerd || {};

  var Router = this.conocerd.route.Router;
  Router
    .config({ mode: 'hash' })
    .add('/', function () {
      console.log('default');
    })
    .add('/about', function () {
      console.log('about');
    })
    .add('/products/:id/edit/:value', function (params) {
      console.log('products', params);
    })
    .listen();

  // returning the user to the initial state
  Router.navigate(Router.getFragment());
}());
