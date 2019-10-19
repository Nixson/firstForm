const http  = require('http'),
    fs 		= require('fs'),
    static  = require("node-static"),
    user    = require(__dirname+'/control/user');
var file = new static.Server('./public');

const server = http.createServer((req, res) => {
    const data = {
        headers: req.headers,
        method: req.method,
        url: req.url
    };
    const url = data.url.substr(1).split('/');
    switch (url[0]) {
        case 'user': user.parse(req,function(headKey,resp){
                        res.writeHead(headKey, {'Content-Type':'application/json'});
                        console.log(typeof resp, JSON.stringify(resp));
                        res.end(JSON.stringify(resp));
                    });
                break;
        default:
            file.serve(req, res);
    }
});

server.listen(8000);

