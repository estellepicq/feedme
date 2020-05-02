var app = require('express')();
var server = require('http').createServer(app);
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var firebaseAdmin = require("firebase-admin");
var config = require('./config/config.json');
var firebaseConfig = require('./config/firebase.json');
var serviceAccount = require('./config/' + config.serviceAccountKey);
var path = require('path');
var exphbs = require('express-handlebars');

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
  var data = getPageData(page);
  var success = true;
  res.render(page, { data, success });
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

function getPageData(page) {
  switch (page) {
    case 'recipes': {
      return [
        {
          id: 123,
          name: 'Banana Bread',
          description: 'Banana bread léger parfait pour le petit-déjeuner',
          thumbnail: 'https://images.unsplash.com/photo-1587121269960-d9d68bfb6f12?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80',
          items: [{ name: 'banane', quantity: '2' }, { name: 'oeufs', quantity: '3' }]
        },
        {
          id: 456,
          name: 'Muffins protéinés',
          description: 'Un en cas protéiné pour les sportifs et les autres !',
          thumbnail: 'https://images.unsplash.com/photo-1585601356536-270d51fe07a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80',
          items: [{ name: 'farine de coco', quantity: '30 grammes' }, { name: 'oeufs', quantity: '2' }]
        }
      ];
    }
    case 'fodmaps-list': { // faire le formatage, penser à rajouter cutoff value dans le name
      return [
        {
          category: 'Fruits',
          low: [
            {
              "name": "Banane",
              "fodmaps_category": "Fruits",
              "fodmaps_indicator": "low",
              "fodmaps_cutoff": "",
              "has_gluten": 0,
              "has_lactose": 0,
              "is_vegetarian": 0,
              "is_vegan": 0,
              "seasons": ""
            },
          ],
          high: [
            {
              "name": "Abricot",
              "fodmaps_category": "Fruits",
              "fodmaps_indicator": "high",
              "fodmaps_cutoff": "",
              "has_gluten": 0,
              "has_lactose": 0,
              "is_vegetarian": 1,
              "is_vegan": 1,
              "seasons": "6,7,8"
            },
            {
              "name": "Ail séché, poudre",
              "fodmaps_category": "Légumes",
              "fodmaps_indicator": "high",
              "fodmaps_cutoff": "",
              "has_gluten": 0,
              "has_lactose": 0,
              "is_vegetarian": 1,
              "is_vegan": 1,
              "seasons": "5, 6, 7, 8, 9, 11, 12"
            }
          ],
        },
        {
          category: 'Viande',
          low: [
            {
              "name": "Agneau",
              "fodmaps_category": "Protéines animales et végétales",
              "fodmaps_indicator": "low",
              "fodmaps_cutoff": "",
              "has_gluten": 0,
              "has_lactose": 0,
              "is_vegetarian": 0,
              "is_vegan": 0,
              "seasons": ""
            },
          ],
          high: [
            {
              "name": "Saucisse",
              "fodmaps_category": "Protéines animales et végétales",
              "fodmaps_indicator": "high",
              "fodmaps_cutoff": "",
              "has_gluten": 0,
              "has_lactose": 0,
              "is_vegetarian": 1,
              "is_vegan": 1,
              "seasons": "6,7,8"
            }
          ],
        }
      ];
    }
    default: {
      return [];
    }
  }
}