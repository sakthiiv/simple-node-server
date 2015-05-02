simple-node-server
============

* A simple node.js server to serve files.
* Colored console output to easily distinguish request information.

## Usage

It comes with the following options

```js

var	defaults = {

	//default port number
	port: 4040,
	
	//default page
	index: 'index.html',
	
	//default directory
	root: 'public',
	
	//specify cache
	noCache: true,
	
	//default content-type
	contentTypeDef: {
		'Content-Type' : 'text/plain' 
	},
	
	//content types to serve
	contentType : {
		html    : 'text/html',
		css     : 'text/css',
		js      : 'text/javascript',
		json    : 'application/json',
		txt     : 'text/plain',
		jpeg    : 'image/jpeg',
		jpg     : 'image/jpeg',
		png     : 'image/png',
		gif     : 'image/gif',
		ico     : 'image/x-icon',
		appcache: 'text/cache-manifest'
	},
	
	//available errors
	errors: {
		404: 'Not Found',
		415: 'Unsupported Media Type',
		500: 'Internal Server Error '
	}
}
```

