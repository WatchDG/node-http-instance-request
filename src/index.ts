import * as http from 'http';
import * as https from 'https';
import {URL} from 'url';
import type {IncomingHttpHeaders} from "http";
import {ok, fail} from "node-result";
import type {TResultAsync} from 'node-result';

export type HttpOptions = http.RequestOptions | https.RequestOptions;

export type RequestOptions = {
    url: URL;
    options: HttpOptions;
    body?: unknown;
};

export type RequestResponse = {
    status: number;
    headers: IncomingHttpHeaders,
    body?: Buffer;
}

export function request(requestOptions: RequestOptions): TResultAsync<RequestResponse, Error> {
    const {url, options, body} = requestOptions;
    const request = url.protocol === 'http:' ? http.request : https.request;
    return new Promise(resolve => {
        try {
            const req = request(url, options, (res) => {
                const status = res.statusCode!;
                const headers = res.headers;
                const contentType = headers['content-type'];
                if (contentType) {
                    let body = Buffer.alloc(0);
                    res.on('data', chunk => body = Buffer.concat([body, chunk], Buffer.byteLength(body) + Buffer.byteLength(chunk)));
                    res.on('end', () => resolve(ok({status, headers, body})));
                } else {
                    resolve(ok({status, headers}));
                }
            });
            req.on('error', error => resolve(fail(error)));
            if (body) req.write(body);
            req.end();
        } catch (error) {
            resolve(fail(error));
        }
    });
}