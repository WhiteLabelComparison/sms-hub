"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requestJs = require("request");
class Request {
    static get(endpoint, query = undefined) {
        return new Promise((result, reject) => {
            requestJs(endpoint + this.generateQueryString(query), (err, res, body) => {
                if (err) {
                    reject(err);
                }
                result({ response: res, body });
            });
        });
    }
    static post(endpoint, query = undefined) {
        return new Promise((result, reject) => {
            requestJs({
                uri: endpoint + this.generateQueryString(query),
                body: JSON.stringify(query),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            }, (err, res, body) => {
                if (err) {
                    reject(err);
                }
                result({ response: res, body });
            });
        });
    }
    static generateQueryString(query) {
        const str = [];
        for (const p in query)
            if (query.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(query[p]));
            }
        return !query ? '' : '?' + str.join('&');
    }
}
exports.Request = Request;
//# sourceMappingURL=request.js.map