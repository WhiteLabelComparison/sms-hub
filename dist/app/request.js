"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var requestJs = require("request");
var Request = (function () {
    function Request() {
    }
    Request.get = function (endpoint, query) {
        var _this = this;
        if (query === void 0) { query = undefined; }
        return new Promise(function (result, reject) {
            requestJs(endpoint + _this.generateQueryString(query), function (err, res, body) {
                if (err) {
                    reject(err);
                }
                result({ response: res, body: body });
            });
        });
    };
    Request.post = function (endpoint, query) {
        var _this = this;
        if (query === void 0) { query = undefined; }
        return new Promise(function (result, reject) {
            requestJs({
                uri: endpoint + _this.generateQueryString(query),
                body: JSON.stringify(query),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }, function (err, res, body) {
                if (err) {
                    reject(err);
                }
                result({ response: res, body: body });
            });
        });
    };
    Request.generateQueryString = function (query) {
        var str = [];
        for (var p in query)
            if (query.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(query[p]));
            }
        return query === undefined ? '' : '?' + str.join("&");
    };
    return Request;
}());
exports.Request = Request;
//# sourceMappingURL=request.js.map