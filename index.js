const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())
//app.use(bodyParser.json({ type: '*/*' }));

require('./routes/user')(app);

const port = process.env.PORT || 8000;
const server = http.createServer(app);
server.listen(port);
console.log("listening");
