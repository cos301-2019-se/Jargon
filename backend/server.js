"use strict";

const http = require("http");
const {parse} = require("querystring");


const server = http.createServer((req, res) => {
    if(req.url==="/"){
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Node Server</title></head>');
        res.write('<body><form action="/friend" method="POST"><input type="text" name="name"><input type="text" name="name2"><button type="submit">Search</button></form></body>');
        res.write('</html>');
        res.end();
    }else if(req.method==="POST" && req.url==="/friend"){
        let reqJSON;
        let body = [];
        req.on('data', (segment) => {
            body.push(segment);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            reqJSON = parse(body);
        })
    }   
});

server.listen(2323, 'localhost');

