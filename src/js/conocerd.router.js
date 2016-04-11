(function () {
  this.conocerd = this.conocerd || {};
  this.conocerd.route = this.conocerd.route || {};
  var ns = this.conocerd.route;

  var RouterModes = {
    HISTORY: 'history',
    HASH: 'hash'
  };

  ns.Router = (function () {
    var routes = [];
    var root = '/';
    var mode = RouterModes.HASH;

    return {
      config: function (options) {
        if (isHistoryModeConfigured(options) && isHistoryAPISupported()) {
          mode = RouterModes.HISTORY;
        } else {
          mode = RouterModes.HASH;
        }

        if (options && options.root) {
          root = '/' + clearSlashes(options.root) + '/';
        }

        return this;
      },
      getFragment: function () {
        var fragment = '';

        if (mode === RouterModes.HISTORY) {
          fragment = decodeURI(location.pathname + location.search);
          fragment = removeQueryString(fragment);
          fragment = root !== '/' ? fragment.replace(root, '') : fragment;
        } else {
          var match = window.location.href.match(/#(.*)$/);
          fragment = match ? match[1] : '';
        }

        return fragment;
      },
      add: function (path, handler) {
        var index = routes.findIndex(function (route) { return route.path === path; });
        if (index !== -1) {
          routes.splice(index, 1);
        }
        routes.push(new Route(path, handler));
        return this;
      },
      remove: function (path) {
        var index = routes.findIndex(function (route) { return route.path === path; });
        routes.splice(index, 1);

        return this;
      },
      flush: function () {
        routes = [];
        mode = null;
        root = '/';

        return this;
      },
      check: function (fragment) {
        var url = fragment || this.getFragment();
        routes.forEach(function (route) {
          if (route.doesUrlMatch(url)) {
            route.executeHandler(route.buildHandlerArgumentsForUrl(url));
          }
        });

        return this;
      },
      listen: function () {
        var self = this;
        var current = null;

        clearInterval(this.interval);
        this.interval = setInterval(function () {
          if (current !== self.getFragment()) {
            current = self.getFragment();
            self.check(current);
          }
        }, 50);

        return this;
      },
      navigate: function (path) {
        if (mode === RouterModes.HISTORY) {
          history.pushState(null, null, root + (clearSlashes(path) || ''));
        } else {
          window.location.href = window.location.href.replace(/#(.*)$/, '') + '#' + (path || '/');
        }

        return this;
      }
    };

    function Route(path, handler) {
      this.path = path;
      var params = this.path.match(/:[a-z0-9]+/gi);

      if (params && params.length) {
        params = params.map(function (param) {
          return param.replace(/:/g, '');
        });
      }

      var route = buildRouteRegExp(path || '/', params || []);

      this.doesUrlMatch = function (url) {
        return route.test(url);
      };

      this.buildHandlerArgumentsForUrl = function (url) {
        var values = url.match(route);

        if (values.length) {
          return values
          .slice(1)
          .reduce(function (args, value, index) {
            args[params[index]] = value;
            return args;
          }, {});
        }

        return {};
      };

      this.executeHandler = function (args) {
        handler.apply({}, [args]);
      };
    }

    function buildRouteRegExp(path, params) {
      var routeString = params.reduce(function (pathToWorkWith, param) {
        return pathToWorkWith.replace(':' + param, '(.*)');
      }, path);

      return new RegExp('^' + routeString.replace('/', '/*') + '$');
    }
  }());

  function isHistoryModeConfigured(options) {
    return options && options.mode && options.mode === RouterModes.HISTORY;
  }

  function isHistoryAPISupported() {
    return !!(history.pushState);
  }

  function clearSlashes(path) {
    return path.toString().replace(/\/$/, '').replace(/^\//, '');
  }

  function removeQueryString(fragment) {
    return fragment.replace(/\?(.*)$/, '');
  }
}());
