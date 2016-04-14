(function (jQuery, Handlebars) {
  this.conocerd = this.conocerd || {};
  this.conocerd.views = this.conocerd.views || {};
  var ns = this.conocerd.views;

  ns.TemplateManager = (function () {
    var templates = [];

    return {
      getTemplate: function (url, callback) {
        var template = templates.find(function (x) { return x.url === url; });

        if (template) {
          callback(template);
        } else {
          jQuery.get(url).done(function (source) {
            template = new Template(url, source);

            templates.push(template);
            callback(template);
          });
        }
      }
    };
  }());

  function Template(url, source) {
    this.url = url;
    this.source = source;
  }

  Template.prototype.compile = function (context) {
    var template = Handlebars.compile(this.source);
    return template(context);
  };
}(window.$, window.Handlebars));
