const express = require('express');
//bodyParser = require('body-parser')
//uuid= require ('uuid')
morgan = require('morgan');//middle ware library that log all data about requests
const app = express();


app.use(morgan('common')); // app.use(bodyParser.json ());


  let users = [
      {
          id : 1 ,
          name: "Billy",
          favoriteMovies:[]
      },

      {
        id : 2 ,
        name: "Bob",
        favoriteMovies:["Kill Bill"]
    },
]


let movies = [ 
            {
              "Title":"Scarface",
              "Description":"In a ruthless rise to Miami drug lord, a Cuban-born gangster descends into addiction, obsession and brutality, with grisly consequences.",
              "Genre": {
                  "Name":"Thriller",
                  "Description": "..."
              },
              "Director":{
              "Name" : "Brian De Palma",
                "Bio" : "Brian Russell De Palma (born September 11, 1940) is an American film director and screenwriter. With a career spanning over 50 years, he is best known for his work in the suspense, crime and psychological thriller genres. His prominent films include mainstream box office hits such as Carrie (1976), Dressed to Kill (1980), Scarface (1983), The Untouchables (1987)",
                "Birth" : 1940
              },
            "ImageURL" : " htttp/ref",
            "Featured" : false
            },

            {
            "Title": "The Godfather",
            "Description" : "The Godfather is a trilogy of American crime films directed by Francis Ford Coppola inspired by the 1969 novel of the same name by Italian American author Mario Puzo. The films follow the trials of the fictional Italian American mafia Corleone family whose patriarch, Vito Corleone, rises to be a major figure in American organized crime.",
            "Genre" : {
                "Name" : "Crime",
                "Description" : "..."
            },
            "Director":{
            "Name" : "Francis Ford Coppola",
              "Bio" : "Francis Ford Coppola was born in 1939 in Detroit, Michigan, but grew up in a New York suburb in a creative, supportive Italian-American family.is an American film director, producer, and screenwriter. He was a central figure in the New Hollywood filmmaking movement of the 1960s and 1970s. His accolades include five Academy Awards, six Golden Globe Awards, two Palmes d'Or, and a British Academy Film Award.",
              "Birth" : 1939
            },
            "ImageURL" : " htttp/ref",
            "Featured" : false
            },

            {
            "Title": "Pulp Fiction",
            "Description" : "Pulp Fiction's narrative is told out of chronological order, and follows three main interrelated stories: Vincent Vega is the protagonist of the first story, Butch Coolidge is the protagonist of the second, and Jules Winnfield is the protagonist of the third.",
            "Genre" : {
                "Name" : "Black comedy crime",
                "Description" : "..."
            },
            "Director":{
            "Name" : "Quentin Tarantino",
              "Bio" : "Quentin Jerome Tarantino (born March 27, 1963) is an American filmmaker, actor, film critic and author. His films are characterized by nonlinear storylines, dark humor, stylized violence, extended dialogue, pervasive use of profanity, ensemble casts, references to popular culture, alternate history, and neo-noir.. Born in Knoxville, Tennessee, Tarantino grew up in Los Angeles.",
              "Birth" : 1963
            },
            "ImageURL" : " htttp/ref",
            "Featured" : false
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


            //setting Endpoints and Routes for ApI


//READ : to return a list of all the movie to user  READ endpoint

app.get ('/movies', (req, res) =>{
  res.send('Successful GET request returns full list of movies');})


//READ : to return data about a single momvie called by title 
app.get ('/movies/:title', (req, res) =>{
   res.send('Successful GET request returns searched movie');})


//READ : to return data about a genre of a movie 
app.get ('/movies/genre/:genreName', (req, res) =>{
  res.send('Successful GET request returns genre of movie');})


//READ : to return data with director's name 
app.get ('/movies/director/:directorName', (req, res) =>{
  res.send('Successful GET request Bio of search director');})

// CREATE a user account
app.post('/users', (req, res) =>{
  req.post('Successful POST creates a new user Account');})

// UPDATE user account
app.put ('/users/:id', (req, res) =>{
  req.put('Successful PUT updates User info');})

// CREATE add movie to favorites movies 
app.post ('/users/:id/:movieTitle', (req, res) =>{
  req.post('Successful POST add movie to list of favorite movies ');})


// DELETE 4. remove a movie from list 
app.delete('/users/:id/:movieTitle', (req, res) =>{
  res.delete('Successful DELETE Removes movie to list of favorites');})



// DELETE 4. delete user account
app.delete ('/users/:id', (req, res) =>{
  res.delete('Successful DELETE will DELETE Account');})


app.use(express.static('public')); 


 app.use((err, req, res, next) => {
  console.error(err.stack); 
  res.status(500).send('Something broke!');
});


app.listen(8080, () =>{
  console.log('Your app is listening on port 8080.');
});




