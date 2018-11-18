function loggedOut( { session }, res, next) {
  if (session && session.userId) {
    return res.redirect('/profile');
  }
  return next();
}

function loggedIn( { session }, res, next) {
  if (session && session.userId) return next();
  const err = new Error('You have to log in to see profile');
  err.status = 401;
  return next(err);
}

module.exports.loggedOut = loggedOut;
module.exports.loggedIn = loggedIn;