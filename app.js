var app = require('express')();
var server = require('http').createServer(app);
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var firebaseAdmin = require("firebase-admin");
var config = require('./config/config.json');
var firebaseConfig = require('./config/firebase.json');
var serviceAccount = require('./config/' + config.serviceAccountKey);
var exphbs = require('express-handlebars');
var request = require('request');

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

// Basics
app.get('/basics', function (req, res) {
  res.render('basics');
});

// Fodmaps Description
app.get('/fodmaps-description', function (req, res) {
  res.render('fodmaps-description');
});

// Fodmaps List
app.get('/fodmaps-list', function (req, res) {
  request('http://nutrimetrics.feedinggood.fr/api/food?fodmaps=1', { json: true }, (err, _res, body) => {
    if (err) {
      res.render('fodmaps-list', { data: [], success: false });
    }
    var data = body && body.length ? formatFodmapItems(body) : [];
    res.render('fodmaps-list', { data, success: true });
  });
});

// Fodmaps Recipes
app.get('/fodmaps-recipes', function (req, res) {
  res.render('fodmaps-recipes');
});

// Recipes
app.get('/recipes', function (req, res) {
  request('http://savr.estellepicq.com/recipes/exportable', { json: true }, (err, _res, body) => {
    if (err) {
      res.render('recipes', { data: [], success: false });
    }
    const recipes = body && body.length ? body : [];
    res.render('recipes', { recipes: recipes, success: true });
  });
});

// Recipe Details
app.get('/recipes/:id', function (req, res) {
  var id = req.params.id;
  request('http://savr.estellepicq.com/recipes/exportable', { json: true }, (err, _res, body) => {
    if (err) {
      res.render('recipes', { data: [], success: false });
    }
    const recipe = body && body.length ? body.find(recipe => recipe._id === id) : {};
    const previousRecipe = body.length > 1 && body.indexOf(recipe) > 0 ? body[body.indexOf(recipe) - 1] : undefined;
    const nextRecipe = body.length > 1 && body.indexOf(recipe) < body.length ? body[body.indexOf(recipe) + 1] : undefined;
    res.render('recipe-details', { recipe, previousRecipe, nextRecipe });
  });
});

// Public output folder
app.use(serveStatic(__dirname + '/public'));

// Server listen
server.listen(port);

function formatFodmapItems(foodItems) {
  var formattedFoodItems = [];
  foodItems.forEach(foodItem => {
    if (!formattedFoodItems.find(ffi => ffi.category === foodItem.fodmaps_category)) {
      // Init Category
      formattedFoodItems.push({
        category: foodItem.fodmaps_category,
        low: [],
        high: [],
      });
    }
    var ffi = formattedFoodItems.find(ffi => ffi.category === foodItem.fodmaps_category);
    foodItem.name += foodItem.fodmaps_cutoff ? ' - ' + foodItem.fodmaps_cutoff + ' max' : '';
    ffi[foodItem.fodmaps_indicator].push(foodItem);
  });
  return formattedFoodItems;
}