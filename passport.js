// Passport strategies for Authentication
const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy, 
  //defines basic HTTP authentication for login request
  Models = require('./models.js'),
  //uses Mongoose to check your database for a user with the same username
  passportJWT = require('passport-jwt');


let Users = Models.User, 
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;


passport.use(new LocalStrategy({
  usernameField: 'Username',
  passwordField: 'Password'
}, 
  (username, password, callback) => {
    console.log(username + '  ' + password);
    Users.findOne({ Username: username }, (error, user) => {
      if (error) {
        console.log(error);
        return callback(error);
      }

      if (!user) {
        console.log('incorrect username');
        return callback(null, false, {message: 'Incorrect username or password.'});
      }
//If error OR username can’t be found in the DB => error message passed to callback:
      console.log('finished');
      return callback(null, user);
    });
}));

passport.use(new JWTStrategy({
//allows you to authenticate users based on the JWT submitted with request
//WT is extracted from the header of the HTTP request.
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'your_jwt_secret'
}, 
  (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
      .then((user) => {
        return callback(null, user);
      })
      .catch((error) => {
        return callback(error)
      });
}));