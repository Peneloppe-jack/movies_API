const express = require('express');
const app = express();


const morgan = require('morgan');
const bodyParser = require('body-parser');
uuid= require ('uuid');


const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
//const Genres = Models.Genre; 
//const Directors = Models.Director;

//connecting mongoose to database to perform CRUD method
mongoose.connect('mongodb://localhost:27017/myFlixDB', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true });


app.use(morgan('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

let auth = require('./auth')(app); 
const passport = require('passport');
require('./passport');

// Welcome page
app.get('/', (req, res) => {
  res.send('Welcome to my FlixApp!');
});

//documetation page
app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

// CREATE a user account to be fixed
app.post('/users', (req, res) =>{
  Users.findOne({ "Userame": req.body.Username })
    .then((user) => {
      if(user){
      return res.status(400).send(req.body.Username + "  Already exists ! ")
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
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
app.put ('/users/:Username', passport.authenticate('jwt', { session: false }), 
 (req, res) =>{
  Users.findOneAndUpdate({ User: req.params.Username }, { 
    $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
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


// GET a user with Username
app.get("/users/:Username", passport.authenticate('jwt', { session: false }),
 (req, res) => {
  Users.findOne({ "Username": req.params.Username })
    .then((user) => {
       res.json(user);
    })
    .catch((err) => {
    console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// GET List users 
app.get('/users', passport.authenticate('jwt', { session: false }),
 (req, res) =>{
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//READ : list of all movies 
app.get('/movies', passport.authenticate('jwt', { session: false }),
(req, res) =>{
Movies.find()
  .then((movies) => {
  res.status(201).json(movies);
  })
  .catch((err) => {
  console.error(err);
  res.status(500).send('Error: ' + error);
  });
});

//READ : a movie called by title  
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) =>{
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


//READ : a genre of movie 
app.get('/genre/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
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

//READ : a director's bio
app.get ('/director/:Name', passport.authenticate('jwt', { session: false }), (req, res) =>{
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




 // CREATE : add movie to favorites movies 
 app.post('/users/:Username/movies/:MovieID', passport.authenticate
 ('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ "Username": req.params.Username }, 
    { $push: { FavoriteMovies: req.params.MovieID }},
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
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ "Username": req.params.Username }, 
      { $pull: { FavoriteMovies: req.params.MovieID }},
  { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        es.json(updatedUser);
      }
  });
});



// DELETE 4. delete user account /'Successful DELETE request will DELETE Account'
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndRemove({ "Username": req.params.Username })
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


app.listen(8080, () =>{
  console.log('Your app is listening on port 8080.');
});




