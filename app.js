var app = require('express')();
var server = require('http').createServer(app);
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var firebaseAdmin = require("firebase-admin");
var config = require('./config/config.json');
var firebaseConfig = require('./config/firebase.json');
var serviceAccount = require('./config/' + config.serviceAccountKey);
var path = require('path');

var port = process.env.PORT || 8084;

//Server is running
console.log('feedinggood is running on localhost:' + port);

// Init Firebase App
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: firebaseConfig.databaseURL
});

global.db = firebaseAdmin.firestore();

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
  // console.log('coucou');
  // res.sendFile(path.join(__dirname, '/public', 'index.html'));
  res.sendFile(__dirname + '/index.html');
});

// Server listen
server.listen(port);
