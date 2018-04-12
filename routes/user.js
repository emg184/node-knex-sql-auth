const queries = require("../queries/auth.js");
const passportService = require('../services/passport');
const passport = require('passport');
const jwt = require('jwt-simple');
const config = require('../config');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user[0].id , iat: timestamp }, config.secret);
}

module.exports = app => {
  app.post("/signup", function (req, res, next) {
    queries.saveUser(req.body.email, req.body.pass, function(err) {
      if (err) {
        return next(err);
      }
    })
      .then(function (result) {
          console.log(result)
          res.status(200).json(result)
      })
      .catch(function (error) {
          next(error);
      });
  });
  /*
  app.post("/signin", function (req, res, next) {
    queries.saveUser(req.body.email, req.body.pass, function(err) {
      if (err) {
        return next(err);
      }
    })
      .then(function (result) {
          console.log(result)
          res.status(200).json(result)
      })
      .catch(function (error) {
          next(error);
      });
  });
  */
  app.post('/signin', requireSignin,
  function(req, res, next) {
    //console.log("in the token for user caller")
    //console.log(req.body)
    res.send({ token: tokenForUser(req.user) });
  });
  app.get("/user/:id", function (req, res, next) {
    queries.findUserById(req.params.id)
      .then(function (result) {
          res.status(200).json(result)
      })
        .catch(function (error) {
            next(error);
        });

  });
  app.get('/', requireAuth, function(req, res){
    res.send({ hi: 'there'});
  });
}
