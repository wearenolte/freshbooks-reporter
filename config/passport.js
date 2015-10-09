var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  bcrypt = require('bcrypt');

passport.serializeUser(function(users, done) {
  done(null, users[0].id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.count().exec(function(err, count){
      if (!count){
        //first user trying to access will be the super admin
        User.create({
          username: username,
          password: password,
          superAdmin: true
        }).exec(function(err, user){
          if (err) {
            return done(null, false, {
              message: 'Could not create Admin User'
            });
          }
          else {
            console.log('ADMIN USER CREATED');
            return done(null, [user]);
          }
        });
      }
      else {
        User.findByUsername(username).exec(function(err, users) {
          if (err) {
            return done(null, err);
          }
          if (!users || users.length < 1) {
            return done(null, false, {
              message: 'Incorrect User'
            });
          }
          bcrypt.compare(password, users[0].password, function(err, res) {
            if (!res) return done(null, false, {
              message: 'Invalid Password'
            });
            return done(null, users);
          });
        });
      }
    });
  }));
