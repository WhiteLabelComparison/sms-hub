# SMS Hub

## Config File

A config TS file must be included in the /src directory. A config.ts.example file is included which can be copied and updated to store correct details. The example config file looks as below.

``` ts
import {ApiKey} from "./app/types/api-key";

export class Config {
    // Express JS Config
    static port: number = 7890;

    // Base URL for the webhooks
    static baseWebhook:string = "";

    // Details of the database connection
    static databaseConnection:string = "postgres://smshub:smshub@localhost:7891/smshub"; // Default for Docker Image

    // Define an Api Key for nexmo
    static nexmo: ApiKey = {
        key: "KEY",
        secret: "SECRET"
    };

}
```

## API Guide

### Authorisation

All API calls must feature a query with the given apikey, if this is not provided then all routes (apart from status) will fail.

Parameter | Type | Validation
----------|------|-----------
apiKey | String | Must be a valid API key

#### Routes

##### Service Status

`GET /status`

This route is used to check that the service is up and running correctly.

###### Parameters

No Parameters are required for this route.

###### Response

A successful response will look as below.

``` json
{
    "success": true,
    "message": "Service is active"
}
```

Any other response shows that the service is not working as intended.

#### Assign Number

`POST /number`

This route is used to request a new telephone number for the given API key.

###### Parameters

No Parameters are required for this route.

###### Response

A successful response will look as below.

``` json
{
    "success": true,
    "telephoneNumber": "447500123456"
}
```

#### Unassign Number

`DELETE /number/:number`

This route is used to request a new telephone number for the given API key.

###### Parameters

Parameter | Type | Validation
----------|------|-----------
number | String | Must be a valid telephone number owned by the API key sending the request.

###### Response

A successful response will look as below.

``` json
{
    "success": true,
    "telephoneNumber": "447500123456"
}
```

