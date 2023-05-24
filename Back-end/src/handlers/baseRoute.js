const { match } = require('path-to-regexp');
import {
  catchError, createJsonErrorMessage,
} from '../functions/utils.js';

const promisify = (handleFunction) => (event, context) => new Promise((resolve, reject) => {
  handleFunction(event, context, (err, res) => {
    if (err) return reject(err);
    return resolve(res);
  });
});

export default class Routes {
  constructor() {
    this.prefix = '';
    this.mapping = {
      GET: {},
      POST: {},
      PUT: {},
      DELETE: {},
      PATCH: {},
      OPTIONS: {},
    };

    const methodFunction = (method) =>
      /**
       * Set a route
       * @param {String|Object<{<Path>: <Object>}>} uri
       * @param {Object<handleFunction: Function, validate: Boolean, schema: Object>} action
       * @returns {Routes}
       */
      function (uri, {
        handleFunction = null, validate = false, schema = {}, middlewares = [],
      } = {}) {
        const { prefix = '' } = this;
        if (Object.prototype.toString.call(uri) === '[object Object]') {
          for (const route in uri) {
            this[method.toLowerCase()](route, uri[route]);
          }
        }
        if (typeof uri === 'string') {
          const routeURI = `${prefix}${uri}`;
          this.mapping[method.toUpperCase()][routeURI] = {
            handleFunction,
            validate,
            schema,
            middlewares,
          };
        }

        return this;
      };
    for (const method in this.mapping) {
      this[method.toLowerCase()] = methodFunction(method);
    }
  }
  /**
   * Get Matched Route
   *
   * @param {String} method
   * @param {String} request
   * @returns {Object<{name: Object, params: Object}>}
   */
  getMatch(method, route) {
    let matchName;
    let matchParams;
    const mapping = this.mapping[method.toUpperCase()] || {};

    for (const routePattern in mapping) {
      const matchData = match(routePattern)(route);
      if (matchData) {
        matchName = routePattern;
        matchParams = matchData.params;
        break;
      }
    }
    return {
      name: mapping[matchName],
      params: matchParams || {},
    };
  }

  /**
   * Router handler
   * @param {Object} event
   * @param {Object} context
   */
  async handler(event, context) {
    try {
      const { pathParameters = {}, httpMethod = '' } = event;
      const { route = '' } = pathParameters;
      const { name: routeData, params } = this.getMatch(httpMethod, route);
      if (routeData) {
        event.customRouteParameters = params;
        const {
          handleFunction, validate, schema, middlewares = [],
        } = routeData;
        let handleFn = promisify(handleFunction);
        return handleFn(event, context);
      }
      return createJsonErrorMessage('The endpoint not found.', { statusCode: 404, event });
    } catch (error) {
      const responseError = catchError({
        message: "An unexpected error occurred while routing the function.",
        file: 'handlingFileName',
        throwError: false,
        event,
        error,
      });
      return createJsonErrorMessage(responseError.data, responseError);
    }
  }
}
