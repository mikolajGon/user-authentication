const
  express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  session = require('express-session'),
  app = express();


app.use(session({
  secret: 'treehouse loves you',
  resave: true,
  saveUninitialized: false
}));

app.use( ({ session }, { locals }, next) => {
  locals.currentUser = session.userId;
  next();
});

mongoose.connect('mongodb://localhost:27017/bookworm');
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
const routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// listen on port 3000
app.listen(1337, function () {
  console.log('Express app listening on port 3000');
});
