const express = require('express');
const app = express();

const morgan = require('morgan');
const bodyParser = require('body-parser');
uuid= require ('uuid');
app.use(morgan('common'));


const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
//const Genres = Models.Genre; 
//const Directors = Models.Director;


//connecting DB to MongoDB and Heroku
//mongoose.connect( process.env.CONNECTION_URI,
  // { useNewUrlParser: true, useUnifiedTopology: true });


//connecting mongoose to Locol database to perform CRUD method
mongoose.connect('mongodb://localhost:27017/myFlixDB', { 
useNewUrlParser: true, 
useUnifiedTopology: true });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 


//new implementting cors allowing access to all domains by default
const cors = require('cors');
app.use(cors()); 


let auth = require('./auth')(app); 
const passport = require('passport');
require('./passport');
 
const { check, validationResult } = require('express-validator');


// Welcome page
app.get('/', (req, res) => {
  res.send('Welcome to my FlixApp!');
});

//documetation page
app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});


// POst-create a user account- work just fine watch your post request syntax in Postman !
app.post('/users',
      [ //here commes the validation logic
        check('Username', 'Username is required').isLength({min: 5}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(), //meaning is required
        check('Email', 'Email does not appear to be valid').isEmail() ], 

  (req, res) => {
    
  let errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }

  let hashedPassword = Users.hashPassword(req.body.Password);
  //Hash any password entered by user when registering - stored in mongoDB
  Users.findOne({ Username: req.body.Username }) //to see if existing user

    .then((user) => {
      if(user){ //new  if user is found-send resp
        return res.status(400).send(req.body.Username + ' already exists');
       
      } else { 
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword, //updated password
          Email: req.body.Email
        
        })
        .then((user) => { 
          res.status(201).json(user); })
        .catch((err) => { 
          console.error(err);
          res.status(500).send('Error: ' + error); })
        }
      })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error ' + err);
  });
});


// UPDATE user account /'Successful PUT request updates User info
app.put('/users/:Username',// passport.authenticate('jwt', { session: false }), 
 
    [ check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),], 
(req, res) => {
      let errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
  Users.findOneAndUpdate ({ Username: req.params.Username }, 
               { $set:{
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email
              }
        },
        { new:true }) //returns the updated document
        .then((updatedUser) => {
          res.json(updatedUser);
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send('Error ' + err);
    });
});

// GET List users For me while I work 
//app.get('/users', (req, res) =>{
//  Users.find()
//    .then((users) => {
//      res.status(201).json(users);
//    })
//    .catch((err) => {
//      console.error(err);
//      res.status(500).send('Error: ' + err);
//    });
//   });

// Get a user by username
app.get("/users/:Username", passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//GET: list of all movies 
app.get('/movies', passport.authenticate ('jwt', { session: false }),
(req, res) => {
Movies.find()
  .then((movies) => {
  res.status(201).json(movies);
  })
  .catch((err) => {
  console.error(err);
  res.status(500).send('Error: ' + error);
  });
});

//GET : a movie called by title  
app.get('/movies/:Title', passport.authenticate ('jwt', { session: false }), 
(req, res) =>{
  Movies.findOne({ Title: req.params.Title })
  .then((movie) => {
    if(movie){
      res.status(200).json(movie);
    }else{
      res.status(400).send('Movie not found.');
    };
  })
  .catch((err) => {
    res.status(500).send('Error: ' + err);
  });
});


//GET : a genre of movie 
app.get('/genre/:Name', passport.authenticate ('jwt', { session: false }),
 (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Name })
    .then((movie) => {
      if(movie){ 
         res.json(movie.Genre.Description);
    }else{
      res.status(400).send('Genre not found.');
    };
    })  
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + error);
    });
});

//GET: a director's bio
app.get ('/director/:Name', passport.authenticate ('jwt', { session: false }), 
(req, res) =>{
  Movies.findOne({ 'Director.Name': req.params.Name })
  .then((movie) => {
    if(movie){
      res.status(200).json(movie.Director.Bio);
    }else{
      res.status(400).send('Director not found.');
    };
  })
  .catch((err) => {
    res.status(500).send('Error ' + err);
  });
});



 // POST : add movie to favorites movies 
 app.post('/users/:Username/movies/:MovieID', passport.authenticate ('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavoriteMovies: req.params.MovieID } },
      { new: true }, 
      (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

// DELETE 4. remove a movie from list 
app.delete('/users/:Username/movies/:MovieID', passport.authenticate ('jwt', { session: false }), 
(req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, 
      { $pull: { FavoriteMovies: req.params.MovieID }},
      { new: true },
     (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
  });
});



// DELETE 4. delete user account /'Successful DELETE request will DELETE Account'
app.delete('/users/:Username', passport.authenticate ('jwt', { session: false }), 
(req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


app.use(express.static('public')); 


 app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).send('Something broke!');
});

let port = process.env.PORT || 8080; 
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
