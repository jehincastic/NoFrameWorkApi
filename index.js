/*
 * Primary file for the API
 *
 */

// Dependency
const http = require("http");
const https = require("https");
const url = require("url");
const StringDecoder = require("string_decoder").StringDecoder;
const fs = require("fs");
const config = require('./config');
const handlers = require('./lib/handlers');


// Instantiate the HTTP server
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
});

// Start the HTTP server
httpServer.listen(config.httpPort, () => {
    console.log("The HTTP server is listening on port " + config.httpPort);
})

// Instantiate the HTTPS server
const httpsServerOptions = {
    'key': fs.readFileSync("./https/key.pem"),
    'cert': fs.readFileSync("./https/cert.pem")
};
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, () => {
    console.log("The HTTPS server is listening on port " + config.httpsPort);
})

// All the server logic for both http and https server 
const unifiedServer = (req, res) => {

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
};

// Define a request router
const router = {
    'ping': handlers.ping,
    'users': handlers.users
};