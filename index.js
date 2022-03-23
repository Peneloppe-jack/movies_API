const express = require('express');

// firts line imports express second encapsulates express functionnalities 
// variable used to route HTTP requestes and responses
morgan = require('morgan');
//middle ware library that log all data about requests

const app = express();
app.use(morgan('common'));

let topMovies = [ // creating Json /movies data
  {
    title: 'Pulp Ficiton',
    director: 'Quentin Tarantino' //  94 : Gangster 
  },
  {
    title: 'Kill Bill',
    director: 'Quentin Tarantino' // 03 : Action drama thriller
  },
  {
    title: '300',
    director: 'Zack snyder' // 06  : Epic historical action comic 
  },
  {
    title: 'The Godfather',
    director: 'Francis Ford Coppola' //72 : Gangster 
  },
  {
    title: 'Sin city',
    director: 'Franck Miller' // 05 : action thriller comic
  },
  {
    title: 'Scarface',
    director: 'Brian De Palma' // 93 Gangster
  },
  {
    title: 'Titanic',
    director: 'James cameron' // 97 Drama Romance
  },

];

// GET requests
app.get('/', (req, res) => {
  res.send('Sit back, relax and enjoy the show!');
});

app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});
// morgan logs requests
app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.');
});

//Serving Static Files via express 
//automatically route  request to send back resp with static public
// HERE documentation.html
// or app.use('/', express.static('public')); so can be customize

app.use(express.static('public')); 



// adding an error handling middleware via express
//retrieves info about any possible error
//code executed everytime e occurs

 app.use((err, req, res, next) => {
  console.error(err.stack); // logs info in terminal
  res.status(500).send('Something broke!');
});


// listen for requests
app.listen(8080, () =>{
  console.log('Your app is listening on port 8080.');
});


