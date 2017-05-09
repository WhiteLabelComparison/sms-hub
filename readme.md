# SMS Hub

## Config File

A config TS file must be included in the /src directory. A config.ts.example file is included which can be copied and updated to store correct details. The example config file looks as below.

``` ts
import {ApiKey} from "./app/types/api-key";

export class Config {
    // Express JS Config
    static port: number = 7890;

    // Base URL for the webhooks
    static baseWebhook:string = "https://smshub.domainname.com"; // Must be changed to the base webhook url

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

This route is used to delete a telephone number for the given API key.

###### Parameters

Parameter | Type | Validation
----------|------|-----------
number | String | Must be a valid telephone number owned by the API key sending the request.

###### Response

A successful response will look as below.

``` json
{
    "success": true,
    "message": "Number was deleted"
}
```

#### Send Message

`POST /send/message`

This route is used to send an SMS message to a number.

###### Parameters

Parameter | Type | Validation
----------|------|-----------
from | String | Must be a valid telephone number owned by the API key sending the request.
to | String | Must be a valid telephone number.
message | String | A string containing the complete message being sent.

###### Response

A successful response will look as below.

``` json
{
    "success": true,
    "messageCount": 1
}
```

`messageCount` will hold the number of messages used to send the message. Depending on the service used 1 message will be between 160 and 180 characters long.

#### View All Sent / Received Messages

`GET /conversation`

This route is used to list all messages sent or received by an API key. It can be filtered by the number used to send / receive the message.

###### Parameters

Parameter | Type | Validation
----------|------|-----------
number | String | Must be a valid telephone number owned by the API key sending the request.

###### Response

A successful response will look as below.

``` json
{
    success: true,
    data: [
        {
            outbound_number: '447500123456',
            inbound_number: '447500999999',
            content: 'This is an outbound text message',
            message_count: 1,
            created_at: '2017-05-09T01:32:36.000Z',
        },
        {
            outbound_number: '447500999999',
            inbound_number: '447500123456',
            content: 'This is an inbound text message',
            message_count: 0,
            created_at: '2017-05-09T01:37:42.000Z',
        }
    ]
}
```

When the text message was incoming the outbound number is the number of the person that sent the message and the inbound number is the number assigned to the API key owner. The cost will also be set to 0 for all inbound messages.

#### View a conversation

`GET /conversation/:outboundNumber`

This route is used to list all messages sent or received by an API key to a specific telephone number.

###### Parameters

Parameter | Type | Validation
----------|------|-----------
number | String | Must be a valid telephone number owned by the API key sending the request.
outboundNumber | String | Must be a valid telephone number.

###### Response

A successful response will look as below.

``` json
{
    success: true,
    data: [
        {
            outbound_number: '447500123456',
            inbound_number: '447500999999',
            content: 'This is an outbound text message',
            message_count: 1,
            created_at: '2017-05-09T01:32:36.000Z',
        },
        {
            outbound_number: '447500999999',
            inbound_number: '447500123456',
            content: 'This is an inbound text message',
            message_count: 0,
            created_at: '2017-05-09T01:37:42.000Z',
        }
    ]
}
```

When the text message was incoming the outbound number is the number of the person that sent the message and the inbound number is the number assigned to the API key owner. The cost will also be set to 0 for all inbound messages.

