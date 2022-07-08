# Prometheus metrics demo

## Setup server

From the root prometheus dir:  
`prometheus>npm i`  
`prometheus>npm start`

## Setup client

Ensure the server is running as above (on 3001)
From the root prometheus dir:  
`prometheus>cd client`  
`prometheus>npm i`  
`prometheus>npm start`  

## Testing loading spinner

In Chrome or dev tools that allow throttling, loading spinner can be delayed by simulating a slow api call via the following toolbar
![image](https://user-images.githubusercontent.com/108941184/178010236-27318d88-0e6e-452d-988b-bf2eec96120e.png)

## Simulating Auth error

Modify the Authorization value returned by `getAuthorizationHeader()` in `client/src/security/Authorization.ts` and re run the server + app.

## Tests

Client app tests:  
`prometheus>cd client`  
`prometheus\client>npm test`
