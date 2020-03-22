var app = require('express')();
var server = require('http').createServer(app);
var serveStatic = require('serve-static');
const bodyParser = require('body-parser');

var port = process.env.PORT || 8084;

//Server is running
console.log('feedinggood is running on localhost:' + port);

// Body parser
app.use(bodyParser.json());

// Routes
var mail = require('./routes/mail');
var signin = require('./routes/signin');
app.use('/mail', mail);
app.use('/signin', signin);

// Public output folder
app.use(serveStatic(__dirname + '/'));
app.use(serveStatic(__dirname + '/public'));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Server listen
server.listen(port);
