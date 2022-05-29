var app = require('express')();
var server = require('http').createServer(app);
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var request = require('request');

var port = process.env.PORT || 8086;
const savrUrl = process.env.NODE_ENV === 'dev' ? 'savr.estellepicq.com' : 'localhost:8085';

//Server is running
console.log('feedme is running on localhost:' + port + '\nBackend is running @ ' + savrUrl);

// Body parser
app.use(bodyParser.json());

// Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Recipes
app.get('/', function (req, res) {
  request(`http://${savrUrl}/recipes/exportable`, { json: true, qs: req.query }, (err, _res, body) => {
    let msg = '';
    if (req.query && Object.keys(req.query).length) {
      msg += '- ';
      for (const prop in req.query) {
        const field = QUERY_MAPPING[prop];
        if (field && req.query[prop]) {
          const txt = field.label;
          const value = field.values && field.values.find(v => v.id === req.query[prop]) ?
            field.values.find(v => v.id === req.query[prop]).label :
            req.query[prop];
          msg += txt + ' : ' + value + ' - ';
        }
      }
    }
    const resultsLength = body ? body.length : 0;
    if (err) {
      res.render('recipes', { recipes: [], success: false, msg });
      return;
    }
    const recipes = resultsLength ? body : [];
    res.render('recipes', { recipes: recipes, success: true, msg, noData: resultsLength === 0 });
  });
});

// Recipe Details
app.get('/recipes/:id', function (req, res) {
  var id = req.params.id;
  request(`http://${savrUrl}/recipes/exportable`, { json: true }, (err, _res, body) => {
    if (err) {
      res.render('recipes', { data: [], success: false });
      return;
    }
    const recipe = body && body.length ? body.find(recipe => recipe._id === id) : {};
    const previousRecipe = body.length > 1 && body.indexOf(recipe) > 0 ? body[body.indexOf(recipe) - 1] : undefined;
    const nextRecipe = body.length > 1 && body.indexOf(recipe) < body.length ? body[body.indexOf(recipe) + 1] : undefined;
    res.render('recipe-details', { recipe, previousRecipe, nextRecipe });
  });
});

app.get('/map', function (req, res) {
  request(`http://${savrUrl}/recipes/exportable`, { json: true, qs: req.query }, (err, _res, body) => {
    const resultsLength = body ? body.length : 0;
    if (err) {
      res.render('map', { recipes: [], success: false });
      return;
    }
    const recipes = resultsLength ? body : [];
    res.render('map', { recipes: JSON.stringify(recipes), success: true, noData: resultsLength === 0 });
  });
});

// Public output folder
app.use(serveStatic(__dirname + '/public'));

// Server listen
server.listen(port);


const QUERY_MAPPING = {
  searchText: {
    label: 'Recherche'
  },
  difficulty: {
    label: 'Difficulté',
    values: [{ id: 'Facile', label: 'Facile'}, { id: 'Moyen', label: 'Moyen'}, { id: 'Difficile', label: 'Difficile'}]
  },
  totalTime: {
    label: 'Temps de préparation',
    values: [
      { id: 'to30', label: 'Moins de 30 minutes' },
      { id: 'from30to60', label: 'Entre 30 minutes et 1 heure' },
      { id: 'from60', label: 'Plus de 1 heure' }
    ]
  },
  energy: {
    label: 'Calories',
    values: [
      { id: 'to400', label: 'Moins de 400 kcal' },
      { id: 'from400to800', label: 'Entre 400 et 800 kcal' },
      { id: 'from800', label: 'Plus de 800 kcal' }
    ]
  },
  proteins: {
    label: 'Protéines',
    values: [
      { id: 'to20', label: 'Moins de 20 g' },
      { id: 'from20to40', label: 'Entre 20 et 40 g' },
      { id: 'from40', label: 'Plus de 40 g' }
    ]
  }
};
