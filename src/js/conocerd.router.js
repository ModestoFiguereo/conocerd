(function () {
  this.conocerd = this.conocerd || {};
  this.conocerd.route = this.conocerd.route || {};
  var ns = this.conocerd.route;

  ns.RouterModes = {
    HISTORY: 'history',
    HASH: 'hash'
  };

  ns.Router = (function () {
    var routes = [];
    var root = '/';
    var mode = ns.RouterModes.HASH;

    return {
      config: function (options) {
        if (isHistoryModeConfigured(options) && isHistoryAPISupported()) {
          mode = ns.RouterModes.HISTORY;
        } else {
          mode = ns.RouterModes.HASH;
        }

        if (options && options.root) {
          root = '/' + clearSlashes(options.root) + '/';
        }

        return this;
      },
      getFragment: function () {
        if (mode === ns.RouterModes.HISTORY) {
          var path = decodeURI(location.pathname + location.search);
          var fragment = removeQueryString(path);

          if (root !== '/') {
            return fragment.replace(root, '');
          }

          return fragment;
        }

        return location.hash.replace('#', '');
      },
      add: function (routeString, handler) {
        this.remove(routeString);

        routes.push(createRoute(routeString, handler));
        return this;
      },
      remove: function (route) {
        var index = routes.findIndex(function (routeObj) { return routeObj.route === route; });
        if (index !== -1) {
          routes.splice(index, 1);
        }

        return this;
      },
      flush: function () {
        routes = [];
        mode = null;
        root = '/';

        return this;
      },
      check: function (fragment) {
        var path = fragment || this.getFragment();
        routes.forEach(function (route) {
          route.executeIfPathMatch(path);
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
        if (mode === ns.RouterModes.HISTORY) {
          history.pushState(null, null, root + clearSlashes(path));
        } else {
          location.hash = window.location.hash = path || root;
        }

        return this;
      }
    };

    function createRoute(route, handler) {
      return {
        route: route,
        paramNames: getParamNames(route || root),
        executeIfPathMatch: function (path) {
          var self = this;
          var routeRegExp = buildRouteRegExp(route, self.paramNames);

          if (routeRegExp.test(path)) {
            var values = path.match(routeRegExp) || [];
            var handlerContext = values.slice(1)
              .reduce(function (context, value, index) {
                context.routeParams[self.paramNames[index]] = value;

                return context;
              }, { routeParams: {} });

            handler.apply(handlerContext);
          }
        }
      };
    }

    function getParamNames(routeString) {
      var paramRegExp = /:[a-z0-9]+/gi;
      var paramNames = routeString.match(paramRegExp) || [];

      return paramNames.map(function (param) {
        return param.replace(/:/g, '');
      });
    }

    function buildRouteRegExp(path, params) {
      var routeString = params.reduce(function (pathToWorkWith, param) {
        return pathToWorkWith.replace(':' + param, '(.*)');
      }, path);

      if (routeString[0] === '/') {
        routeString = routeString.replace('/', '/*');
      }

      if (routeString[routeString.length - 1] === '/') {
        routeString = routeString + '*';
      } else {
        routeString = routeString + '/*';
      }

      return new RegExp('^' + routeString + '$');
    }
  }());

  function isHistoryModeConfigured(options) {
    return options && options.mode && options.mode === ns.RouterModes.HISTORY;
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
