"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reasons = require("./reasons");

var _methods = require("./methods");

var _robotsTxtGuard = _interopRequireDefault(require("robots-txt-guard"));

var _isurl = _interopRequireDefault(require("isurl"));

var _robotsTxtParse = _interopRequireDefault(require("robots-txt-parse"));

var _requestHTTP = _interopRequireDefault(require("./requestHTTP"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Download and parse a robots.txt file from a server's root path.
 * @param {URL} url
 * @param {object} auth
 * @param {URLCache} cache
 * @param {object} options
 * @throws {TypeError} non-URL
 * @returns {Promise<guard>}
 */
var _default = async (url, auth, cache, options) => {
  if (!_isurl.default.lenient(url)) {
    throw new TypeError(_reasons.BLC_INVALID);
  } else {
    url = new URL(url);
    url.hash = "";
    url.pathname = "/robots.txt";
    url.search = "";
    const {
      stream
    } = await (0, _requestHTTP.default)(url, auth, _methods.GET_METHOD, cache, options); // @todo https://github.com/tc39/proposal-pipeline-operator

    return (0, _robotsTxtGuard.default)(await (0, _robotsTxtParse.default)(stream));
  }
};

exports.default = _default;
module.exports = exports.default;
//# sourceMappingURL=getRobotsTxt.js.map