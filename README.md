# http-instance-request

## install

```shell
yarn install http-instance-request
# or
npm install http-instance-request
```

## example

```ts
import {request} from "http-instance-request";
import {URL} from "url";

(async () => {

    const {status, headers, body} = (await request({
        url: new URL('https://example.com'),
        options: {
            method: 'GET'
        }
    })).unwrap();

    console.log('> status:', status);
    console.log('> headers:', headers);
    console.log('> body:', body);

})();
```