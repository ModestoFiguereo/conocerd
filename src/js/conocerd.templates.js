(function (jQuery) {
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
          jQuery.get(url).done(function (html) {
            template = new Template(url, html);

            templates.push(template);
            callback(template);
          });
        }
      }
    };
  }());

  function Template(url, html) {
    this.url = url;
    this.html = html;
  }
}(window.$));
