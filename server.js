var http = require('http');
var fs = require('fs');
var io = require('socket.io');
var path = require('path');



var server = http.createServer(function(req,res){

	var contentTypeExt = {
		"html" : 'text/html; charset=utf-8',
		"js" : 'text/javascript'
	}	
	

	console.log(req.url);
	var filePath = '.' + req.url;
	console.log(filePath);

    if (filePath === './' || req.url === '/')
        filePath = './index.html';

    var extname = path.extname(filePath);

    var contentType = contentTypeExt[extname];


	fs.readFile(filePath, function(err, data){
		res.writeHead(200,{
			'Contetn-type' : contentType
		});
		res.end(data, 'utf8');
	});
	
});

server.listen(3334);
var sio = io.listen(server);

var lastValue = "";

sio.sockets.on('connection', function(socket){
	if(sio.sockets.clients().length===1 || socket.id === sio.sockets.clients()[0].id){
		socket.json.send({kind: "setLeader", val: true});
		sio.sockets.json.send({kind: "sendNumbers", val: lastValue});
		console.log("NUMBER 1");
	}else{
		sio.sockets.json.send({kind: "sendNumbers", val: lastValue});
		console.log("LAST VALUE: " + lastValue);
	}


	socket.on('publish', function(message){
		lastValue = message;
		console.log("LAST VALUE: " + lastValue);
		sio.sockets.json.send({kind: "sendNumbers", val: message});
	});
	socket.on('broadcast', function(message){
		lastValue = message;
		console.log("LAST VALUE: " + lastValue);
		sio.sockets.json.send({kind: "sendNumbers", val: message});
		
	});
	socket.on('whisper', function(message){
		socket.broadcast.emit('secret',message);
	});
	socket.on('disconnect', function(){
		if(sio.sockets.clients().length>1){
			if(socket.id === sio.sockets.clients()[0].id){
				sio.sockets.clients()[1].json.send({kind: "setLeader", val: true});
				console.log("NUMBER 1");
			}
		}else{
			lastValue ="";
		}
		console.log(socket.id + " " + sio.sockets.clients()[0].id);
	});

});



console.log('listening on http://localhost/3333');