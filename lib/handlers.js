/*
 * Request handlers
 *
 */

// Dependencies

// Define the handlers
const handlers = {};

// Users handler
handlers.users = (data, callBack) => {
	const acceptableMethods = ['post', 'get', 'put', 'delete'];
	if (acceptableMethods.indexOf(data.method) > -1) {
		handlers._users[data.method](data, callBack);
	} else {
		callBack(405);
	}
};

// Container for user submethods
handlers._users = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = (data, callBack) => {
	// Check that all required fields are filled out
	const firstName =
		typeof data.payload.firstName == 'string' &&
		data.payload.firstName.trim().length > 0
			? data.payload.firstName.trim()
			: false;
	const lastName =
		typeof data.payload.lastName == 'string' &&
		data.payload.lastName.trim().length > 0
			? data.payload.lastName.trim()
			: false;
	const phone =
		typeof data.payload.phone == 'string' &&
		data.payload.phone.trim().length == 10
			? data.payload.phone.trim()
			: false;
	const password =
		typeof data.payload.password == 'string' &&
		data.payload.password.trim().length > 0
			? data.payload.password.trim()
			: false;
	const tosAgreement =
		typeof data.payload.password == 'boolean' &&
		data.payload.password == true
			? true
			: false;

	if (firstName && lastName && phone && password && tosAgreement) {
        
	} else {
		callBack(400, { Error: 'Missing Required Field' });
	}
};

// Users - get
handlers._users.get = (data, callBack) => {};

// Users - put
handlers._users.put = (data, callBack) => {};

// Users - delete
handlers._users.delete = (data, callBack) => {};

// Ping handler
handlers.ping = (data, callBack) => {
	callBack(200, { alive: true });
};

// Not found handler
handlers.notFound = (data, callBack) => {
	callBack(404);
};

// Export the module
module.exports = handlers;
