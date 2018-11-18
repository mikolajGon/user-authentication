const
  mongoose = require('mongoose'),
  bcrypt = require('bcrypt'),
  UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    favoriteBook: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    }
  });

UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({ email })
    .exec(function(err, user) {
      if (err) return callback(err);
      else if (!user) {
        const err = new Error('User not found');
        err.status = 401;
        return callback(err);
      }
      bcrypt.compare(password, user.password, function(err, result) {
        if (result) {
          return callback(null, user);
        } else {
          return callback();
        }
      })
    })
}

UserSchema.pre('save', function(next) {
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  })
});
const User = mongoose.model('User', UserSchema);

module.exports = User;