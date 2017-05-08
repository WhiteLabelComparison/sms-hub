import * as requestJs from 'request';

/**
 * Class used to perform simple get and post requests.
 */
export class Request {

    /**
     * Performs a post request to an endpoint. Returns a promise with the
     * results from the query so it can be called asynchronous.
     *
     * @param endpoint - The full URL to be called
     * @param query - An object holding all query parameters
     *
     * @returns {Promise<any>} - The asynchronous promise
     */
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