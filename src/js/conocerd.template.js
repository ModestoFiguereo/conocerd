(function (namespace, Handlebars) {
  var ns = namespace('conocerd.views');

  function Template(url, source) {
    this.url = url;
    this.source = source;
  }

  Template.prototype.compile = function (context) {
    var template = Handlebars.compile(this.source);
    return template(context);
  };

  ns.Template = Template;
}(window.namespace, window.Handlebars));
