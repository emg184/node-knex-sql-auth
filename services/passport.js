const bcrypt = require('bcrypt-nodejs');
const queries = require("../queries/auth.js");
const passport = require('passport');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy =  require('passport-local');

const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  console.log("I'm in here")
  queries.findUserByEmail(email)
    .then(function(result) {
      Promise.resolve(result).then(function(res) {
        //console.log(typeof res)
        //console.log(!Array.isArray(res))
        //console.log(res.length == 1)
        if (typeof res === 'object' && res.length == 1 ) {
          comparePassword(res[0].password, password,  function(err, isMatch) {
                if (err) {
                  return done(err);
                }
                if (!isMatch) {
                 return done(null, false);
                }

                return done(null, res);
                })
          } else {
          console.log("uncompared")
          return "That user doesn't exist"
        }
      })
    })
//  User.findOne({ email: email }, function(err, user) {
//    if (err) { return done(err); }
//    if (!user) { return done(null, false); }
//
//    user.comparePassword(password, function(err, isMatch) {
//      if (err) {
//        return done(err);
//      }
//      if (!isMatch) {
//        return done(null, false);
//      }
//
//      return done(null, user);
//    });
//  });
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  console.log("Login")
  console.log(payload)
  queries.findUserById(payload.sub)
    .then(function(user) {
    //if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

function comparePassword(candidatePassword, hashedPassword, callback) {
  console.log("comparing")
  console.log(hashedPassword, candidatePassword)
  bcrypt.compare(hashedPassword, candidatePassword, function(err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
}

passport.use(jwtLogin);
passport.use(localLogin);
