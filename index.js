/*
 * Primary file for the API
 *
 */

// Dependency
const http = require("http");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;

// The server should respond to all requests with a string
const server = http.createServer((req, res) => {

    // Get URL and parse it
    const paredUrl = url.parse(req.url, true);

    // Get the path
    const path = paredUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    //Get the query string as an object
    const queryStringObject = paredUrl.query;

    //Get the HTTP Method
    const method = req.method.toLowerCase();

    // Get the Headers as objects
    const headers = req.headers;

    // Get the payload, if any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', data => {
        buffer += decoder.write(data);
    });
    req.on('end', () => {
        buffer += decoder.end();
        
        // Choose the handler this request should go to. If one is not found, use the not found handler
        const chosenHandler = router.hasOwnProperty(trimmedPath) ? router[trimmedPath] : handlers.notFound;

        // Construct the data object to send to the handler
        const data = {
            'trimmedPath': trimmedPath,
            'queryStringObject': queryStringObject,
            'method': method,
            'headers': headers,
            'payload': buffer
        };

        // Route the request to handler specified in the routers
        chosenHandler(data, (statusCode, payload) => {
            // Use the status code called back by the handler, or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            // Use the payload called back by the handler, or default to an empty object
            payload = typeof(payload) == 'object' ? payload : {};

            // Convert payload to a string
            const payloadString = JSON.stringify(payload);
            
            // Return the response
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // Log the request path
            console.log("Returning the response: ", statusCode, payloadString);

        });
    });
});

// Start the server, and have it listen on port 3000
server.listen(3000, () => {
    console.log("The server is listening on port 3000");
})

// Define the handlers
const handlers = {};

// Sample handler
handlers.sample = (data, callBack) => {
    // Callback a http status code, and a payload object
    callBack(200, {'name': 'sample handler'});
};

// Not found handler
handlers.notFound = (data, callBack) => {
    callBack(404);
};

// Define a request router
const router = {
    'sample': handlers.sample
};