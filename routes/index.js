const
  express = require('express'),
  router = express.Router(),
  User = require('../models/user'),
  mid = require('../middleware');

router.get('/', function(req, res) {
  return res.render('index', { title: 'Home' });
});

router.get('/about', function(req, res) {
  return res.render('about', { title: 'About' });
});

router.get('/contact', function(req, res) {
  return res.render('contact', { title: 'Contact' });
});

router.get('/register', mid.loggedOut, function (req, res) {
  return res.render('register', { title: 'Sign Up!' });
});

router.post('/register', function ({ body, session }, res, next) {
  if (
    body.email &&
    body.name &&
    body.favoriteBook &&
    body.password &&
    body.confirmPassword
    ){
      if (body.password !== body.confirmPassword) {
        const err = new Error('Passwords do not match.');
        err.status = 400;
        return next(err);
      }

      const userData = { email, name, favoriteBook, password } = body;

      User.create(userData, (err, user) => {
        if (err) return next(err);
        session.userId = user._id;
        return res.redirect('/profile');
      });

    } else {
      const err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
});

router.get('/login', mid.loggedOut, function (req, res) {
  return res.render('login', { title: 'Log In' });
});

router.post('/login', function ( { body: { email, password }, session }, res, next) {
  if (email, password) {
    User.authenticate(email, password, function (err, user) {
      if ( err || !user ) {
        const err = new Error('Wrong username or password!');
        err.status = 401;
        return next(err);
      }
      session.userId = user._id;
      return res.redirect('/profile');
    })
  }else {
    const err = new Error('Please type in username and password!');
    err.status = 401;
    return next(err);
  }
});

router.get('/profile', mid.loggedIn, function({ session },res,next) {
  User.findById(session.userId)
    .exec((err, { name, favoriteBook}) => {
      if(err) return next(err);
      return res.render('profile', { title: 'Profile', name, favoriteBook });
    })
})

router.get('/logout', ( { session }, res, next ) => {
  if (session) {
    session.destroy(err => {
      if (err) return next(err);
      res.redirect('/');
    });
  }
});

module.exports = router;
