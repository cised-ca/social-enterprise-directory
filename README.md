# Backend for the Social Enterprise directory

The directory uses Node, Swagger (..and Mongo.. coming soon!) on the backend.

## To install
* `npm install`

## To start
* `npm start`

## To use
* http://localhost:10010/api/v1/directory
* http://localhost:10010/api/v1/enterprise/{id}

# Swagger commands for development/testing
First install the swagger command line
* `npm install -g swagger`
* Further reference: https://github.com/swagger-api/swagger-node

Starting server
* as alternative to `npm start` you can use `swagger project start`
* the advantage is that it will auto-detect any file modifications and nicely restart the server for you (kind of like nodemon)

To view our API documentation in Swagger UI:
* `swagger project edit` then open browser to the URL shown in the console (if it does not automatically open for you)
* One neat thing is that you can use the "Try this operation" button to send requests to the server from this UI

To run server in swagger's mock mode
* `swagger project start -m`
* This starts the server but stubs out all the controllers on the server and auto responds to API requests with mock data that conforms to the API definition. Mainly used when trying out the API or testing the clients before the server code is finished.
