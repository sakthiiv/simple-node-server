var http    = require('http'),
    url     = require('url'),
    path    = require('path'),
    fs      = require('fs'),
    util    = require('util');
		
var defaults = {
	port: 4040,
	index: 'index.html',
	root: 'public',
	noCache: true,
	contentTypeDef: {
		'Content-Type' : 'text/plain' 
	},
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
		appcache: 'text/cache-manifest',
		mp4		: 'video/mp4'
	},
	errors: {
		404: 'Not Found',
		415: 'Unsupported Media Type',
		500: 'Internal Server Error '
	}
}, server = http.createServer(
	requestReceived
);

var color = {
	red: '\x1b[31m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	blue: '\x1b[34m',
	magenta: '\x1b[35m',
	cyan: '\x1b[36m'
}, colorReset = '\x1b[0m';

function requestReceived(request, response) {
	var uri = url.parse(request.url), hostname = [], logEntry;
	uri = uri.pathname, root = defaults.root;
	
	if (uri === '/')
		uri = '/' + defaults.index;
		
	if (root.length === 0)
		root = ".";
		
	var filename = path.join(
		root,
		uri
	);
	
	logEntry = color.cyan + request.method + colorReset + ' ' + color.green + request.url + colorReset;
    if (request.headers['user-agent']) {
        logEntry += ' ' + request.headers['user-agent'];
    }
	console.log(logEntry);

	fs.exists(filename, function (exists){
		deliverFile(filename, exists, response);
	});
};

function alterResponse(response, body, status, headers, encoding) {
	if (status in defaults.errors)
		console.log(color.red, status, body, colorReset);

	if (!headers)
		headers = defaults.contentTypeDef;
		
	if (defaults.noCache)
		headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
	
	if(!encoding)
		encoding='utf8';

	response.writeHead(
		status,
		headers
	);
	response.write(body, encoding);
	response.end();
	return;
}

function deliverFile(filename, exists, response) {
	
	var contentType = path.extname(filename).slice(1);

	if (!exists) {
		alterResponse(response, defaults.errors['404'], 404, defaults.contentTypeDef);
		return;
	}
	
	if (!defaults.contentType[contentType]) {
		alterResponse(response, defaults.errors['415'], 415, defaults.contentTypeDef);
		return;
	}
	var readStream = fs.createReadStream(filename);
	
	readStream.on('open', function(){
		var headers = {
			'Content-Type' : defaults.contentType[contentType]
		};

		if (defaults.noCache)
			headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
			
		response.writeHead(
			200,
			headers
		);
			
		readStream.pipe(response);
	});
	
	readStream.on('error', function(){
		alterResponse(response, defaults.errors['500'] + err, 500, defaults.contentTypeDef);
		console.log(util.inspect(err));
	});
}

server.listen(defaults.port, function() {
		console.log('*** UI Server listening on port ' + defaults.port + ' ***');
	}
);



