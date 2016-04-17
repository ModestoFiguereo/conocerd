(function (namespace) {
  var ns = namespace('conocerd.route');

  var ROOT = '/';
  var PARAM_PREFIX = ':';
  var PARAM_NAME_REGEXP = /:[a-z0-9]+/gi;
  var PATH_PARAM_REGEXP_STRING = '([^/]+?)';
  var ROUTER_MODES = {
    HISTORY: 'HISTORY',
    HASH: 'HASH'
  };

  ns.RouterModes = ROUTER_MODES;

  var Router = (function () {
    var routes = [];
    var defaultRoute = null;
    var mode = ROUTER_MODES.HASH;

    return {
      config: function (options) {
        var opts = options || {};

        mode = ROUTER_MODES[opts.mode] || ROUTER_MODES.HASH;
        if (mode === ROUTER_MODES.HISTORY) {
          if (historyAPIIsNotSupported()) {
            mode = ROUTER_MODES.HASH;
          }
        }

        if (opts.root) {
          ROOT = '/' + clearSlashes(opts.root) + '/';
        }

        return this;
      },
      getCurrentPath: function () {
        if (mode === ROUTER_MODES.HISTORY) {
          var path = location.pathname + location.search;
          path = decodeURI(path);
          path = removeQueryString(path);
          path = (ROOT !== '/') ? path.replace(ROOT, '') : path;

          return path;
        }

        return location.hash.replace('#', '');
      },
      add: function (path, handler) {
        this.remove(path);
        routes.push(createRoute(path, handler));

        return this;
      },
      otherwise: function (handler) {
        defaultRoute = createRoute('default', handler);
      },
      remove: function (path) {
        var index = routes.findIndex(function (route) {
          return route.path === path;
        });

        if (index !== -1) {
          routes.splice(index, 1);
        }

        return this;
      },
      check: function (fragment) {
        var exist = false;

        var path = fragment || this.getCurrentPath();
        routes.forEach(function (route) {
          if (route.match(path)) {
            exist = true;
            route.execute();
          }
        });

        if (!exist && defaultRoute) {
          defaultRoute.execute();
        }

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
        go(mode, path);

        return this;
      },
      flush: function () {
        routes = [];
        mode = null;
        ROOT = '/';

        return this;
      }
    };
  }());

  // returning the user to the initial state
  Router.navigate(Router.getCurrentPath()).listen();
  ns.Router = Router;

  function historyAPIIsNotSupported() {
    return typeof history.pushState !== 'undefined';
  }

  function createRoute(path, handler) {
    var paramNames = getParamNamesFromPath(path || ROOT);
    var pathRegexp = pathToRegexp(path, paramNames);

    return {
      path: path,
      match: function (currentPath) {
        return pathRegexp.test(currentPath);
      },
      execute: function () {
        var context = buildRouteContext(paramNames, pathRegexp);
        handler.apply(context);
      }
    };
  }

  function getParamNamesFromPath(path) {
    var paramNames = match(path, PARAM_NAME_REGEXP).map(function (paramName) {
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

  function buildRouteContext(paramNames, pathRegexp) {
    return {
      hash: location.hash,
      host: location.host,
      hostname: location.hostname,
      href: location.href,
      origin: location.origin,
      pathname: location.path,
      port: location.port,
      protocol: location.protocol,
      navigate: Router.navigate,
      params: match(Router.getCurrentPath(), pathRegexp)
        .slice(1)
        .reduce(function (params, value, index) {
          params[paramNames[index]] = value;

          return params;
        }, {})
    };
  }

  function match(string, regexp) {
    return string.match(regexp) || [];
  }

  function go(mode, path) {
    if (mode === ROUTER_MODES.HISTORY) {
      history.pushState(null, null, ROOT + clearSlashes(path));
    } else {
      location.hash = ROOT + clearSlashes(path);
    }
  }

  function clearSlashes(path) {
    return path.toString()
      .replace(/\/$/, '')
      .replace(/^\//, '');
  }

  function removeQueryString(fragment) {
    return fragment.replace(/\?(.*)$/, '');
  }
}(window.namespace));
