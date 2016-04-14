(function () {
  this.conocerd = this.conocerd || {};
  this.conocerd.route = this.conocerd.route || {};
  var ns = this.conocerd.route;

  var ROOT = '/';
  var PARAM_PREFIX = ':';
  var PARAM_NAME_REGEXP = /:[a-z0-9]+/gi;
  var PATH_PARAM_REGEXP_STRING = '([^\/]+?)';
  var ROUTER_MODES = {
    HISTORY: 'history',
    HASH: 'hash'
  };

  ns.RouterModes = ROUTER_MODES;

  ns.Router = (function () {
    var routes = [];
    var mode = ROUTER_MODES.HASH;

    return {
      config: function (options) {
        if (isHistoryModeConfigured(options) && isHistoryAPISupported()) {
          mode = ns.RouterModes.HISTORY;
        } else {
          mode = ns.RouterModes.HASH;
        }

        if (options && options.root) {
          ROOT = '/' + clearSlashes(options.root) + '/';
        }

        return this;
      },
      getCurrentPath: function () {
        if (mode === ns.RouterModes.HISTORY) {
          var path = decodeURI(location.pathname + location.search);
          var fragment = removeQueryString(path);

          if (ROOT !== '/') {
            return fragment.replace(ROOT, '');
          }

          return fragment;
        }

        return location.hash.replace('#', '');
      },
      add: function (path, handler) {
        this.remove(path);

        routes.push(createRoute(path, handler));
        return this;
      },
      remove: function (path) {
        var index = routes.findIndex(function (route) { return route.path === path; });
        if (index !== -1) {
          routes.splice(index, 1);
        }

        return this;
      },
      flush: function () {
        routes = [];
        mode = null;
        ROOT = '/';

        return this;
      },
      check: function (fragment) {
        var path = fragment || this.getCurrentPath();
        routes.forEach(function (route) {
          route.executeHandlerIfPathMatch(path);
        });

        return this;
      },
      listen: function () {
        var self = this;
        var current = null;

        clearInterval(this.interval);
        this.interval = setInterval(function () {
          if (current !== self.getCurrentPath()) {
            current = self.getCurrentPath();
            self.check(current);
          }
        }, 50);

        return this;
      },
      navigate: function (path) {
        if (mode === ROUTER_MODES.HISTORY) {
          history.pushState(null, null, ROOT + clearSlashes(path));
        } else {
          location.hash = path || ROOT;
        }

        return this;
      }
    };
  }());

  function createRoute(path, handler) {
    return {
      path: path,
      paramNames: getParamNamesFromPath(path || ROOT),
      executeHandlerIfPathMatch: function (currentPath) {
        var self = this;
        var pathRegExp = pathToRegexp(path, self.paramNames);

        if (pathRegExp.test(currentPath)) {
          var values = currentPath.match(pathRegExp) || [];
          var handlerContext = values.slice(1)
          .reduce(function (context, value, index) {
            context.routeParams = context.routeParams || {};
            context.routeParams[self.paramNames[index]] = value;

            return context;
          }, {});

          handler.apply(handlerContext);
        }
      }
    };
  }

  function getParamNamesFromPath(path) {
    var paramNames = (path.match(PARAM_NAME_REGEXP) || []).map(function (paramName) {
      return paramName.replace(/:/g, '');
    });

    return paramNames;
  }

  function pathToRegexp(path, params) {
    var regexpString = params.reduce(paramToRegexpString, path)
    .replace('/', '/?')
    .replace(/\/$/, '') + '/?';

    return new RegExp('^' + regexpString + '$');
  }

  function paramToRegexpString(path, param) {
    return path.replace(PARAM_PREFIX + param, PATH_PARAM_REGEXP_STRING);
  }

  function isHistoryModeConfigured(options) {
    return options && options.mode && options.mode === ROUTER_MODES.HISTORY;
  }

  function isHistoryAPISupported() {
    return !!(history.pushState);
  }

  function clearSlashes(path) {
    return path.toString()
      .replace(/\/$/, '')
      .replace(/^\//, '');
  }

  function removeQueryString(fragment) {
    return fragment.replace(/\?(.*)$/, '');
  }
}());
