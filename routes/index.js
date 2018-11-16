const
  express = require('express'),
  router = express.Router();

router.get('/', function(req, res) {
  return res.render('index', { title: 'Home' });
});

router.get('/about', function(req, res) {
  return res.render('about', { title: 'About' });
});

router.get('/contact', function(req, res) {
  return res.render('contact', { title: 'Contact' });
});

router.get('/register', function (req, res) {
  return res.render('register', { title: 'Sign Up!' });
});

router.post('/register', function (req, res) {

});

module.exports = router;
