var app = require('express')();
var server = require('http').createServer(app);
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var firebaseAdmin = require("firebase-admin");
var config = require('./config/config.json');
var firebaseConfig = require('./config/firebase.json');
var serviceAccount = require('./config/' + config.serviceAccountKey);
var path = require('path');
var exphbs  = require('express-handlebars');

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

// Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Home
app.get('/', function (req, res) {
  res.render('home');
});

// Pages
app.get('/:page', function (req, res) {
  var page = req.params.page;
  res.render(page);
});

// Recipes
app.get('/recipes/:id', function (req, res) {
  var id = req.params.id;
  res.render('recipe-details', {
    recipe: {
      id: 123,
      name: 'Banana Bread',
      items: [{ name: 'banane', quantity: '2' }, { name: 'oeufs', quantity: '3' }]
    }
  });
});

// Public output folder
app.use(serveStatic(__dirname + '/public'));

// Server listen
server.listen(port);
