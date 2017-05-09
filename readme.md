# SMS Hub

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
    success:true,
    message:"Service is active"
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
    success: true,
    telephoneNumber: '447500123456'
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
    success: true,
    telephoneNumber: '447500123456'
}
```

