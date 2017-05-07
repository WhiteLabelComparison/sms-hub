import * as requestJs from 'request';

export class Request {

    static get(endpoint: string, query: any = undefined): Promise<any>{
        return new Promise<any>((result,reject) => {

            requestJs(endpoint + this.generateQueryString(query), (err, res, body) => {
                if (err) {
                    reject(err);
                }

                result({response: res, body: body});
            });

        });
    }



    static post(endpoint: string, query: any = undefined): Promise<any> {
        return new Promise((result,reject) => {
            requestJs({
                uri: endpoint + this.generateQueryString(query),
                method: 'POST',
            }, (err, res, body) => {
                if (err) {
                    reject(err);
                }

                result({response: res, body: body});
            });
        });
    }

    /**
     * Generates an url encoded query string for a get request.
     *
     * @param query - An object holding the query strings
     * @returns {string|string}
     */
    static generateQueryString(query: any): string {
        let str = [];
        for(let p in query)
            if (query.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(query[p]));
            }

        return query === undefined ? '' : '?' + str.join("&");
    }

}