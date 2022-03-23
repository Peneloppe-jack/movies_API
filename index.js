const express = require('express');
const app = express();
bodyParser =require ('bodyParser')
 uuid=require ('uuid')

app.use(bodyParser.json ());

let users = [
{
    "id" : 1,
    "name" : "User1",
    "Password": "String",
    "Email": "String",
    "Birthday": "Date",
    "favoriteMovie" : ["Movies"]
},
{
  "id" : 2,
  "name" : "User2",
  "Password": "String",
  "Email": "String",
  "Birthday": "Date",
  "favoriteMovie" : ["Movie"]
},

]


let movies = [

  {
          "Title": "Scarface",
          "Description" : "blablabla",
          " Genre" : {
              "Name" : "Gangster",
              "Description" : "..."
          },

          "Director":{
          " Name" : "Brian De Palma",
            "Bio" : "...",
            "Birth" : 1958
        },
        " ImageURL" : " htttp/ref",
        " Featured" : false
  },

  {
    "Title": "Kill Bill",
    "Description" : "blablabla",
    " Genre" : {
        "Name" : "Action",
        "Description" : "..."
    },

    "Director":{
    " Name" : "Quentin Tarantino",
      "Bio" : "...",
      "Birth" : 1959
  },
  " ImageURL" : " htttp/ref",
  " Featured" : false
},
];



// let topMovies = [ // creating Json /movies data
//   {
//     title: 'Pulp Ficiton',
//     director: 'Quentin Tarantino' // Genre : Gangster 
//   },
//   {
//     title: 'Kill Bill',
//     director: 'Quentin Tarantino' // 03 : Action drama thriller
//   },
//   {
//     title: '300',
//     director: 'Zack snyder' // 06  : Epic historical action comic 
//   },
//   {
//     title: 'The Godfather',
//     director: 'Francis Ford Coppola' //72 : Gangster 
//   },
//   {
//     title: 'Sin city',
//     director: 'Franck Miller' // 05 : action thriller comic
//   },
//   {
//     title: 'Scarface',
//     director: 'Brian De Palma' // 93 Gangster
//   },
//   {
//     title: 'Titanic',
//     director: 'James cameron' // 97 Drama Romance
//   },

// ];

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

// CRUD Create Read Update Delete 
    //2. check body parser ref if you needd to download something
    // note on postman raw body J son  
// CREATE
app.post ('/users', (req, res) =>{
  const newUser = req.body;

  if (newUser.name){
    newUser.id = uuid.v4();
    users.push (newUser);
    res.status(201).json(newUser)
} else {
    res.status(400).send('Users need name') 
}
})

// UPDATE
app.put ('/users/: id', (req, res) =>{
  const { id } = req. params; 
  const updatedUser = req.body;

  let user = users.find(user => user.id === id);
  
  if (user.name){
    user.name = updatedUser.name;
    res.status(200).json(user);
} else {
    res.status(400).send('User not found') 
}
})

  
// CREATE a fav list movie 3. fav movie from list 
app.post ('/users/:id/:movieTitle', (req, res) =>{
    const { id, movieTitle } = req. params; 

    let user = users.find(user => user.id === id);

    if (user){
      user.favoriteMovies.push(movieTitle);
      res.status(200).send(`${movieTitle} has been added to user ${id}'s array`);;
  } else {
      res.status(400).send('Movie not found') 
  }
})

// DELETE 4. remove a movie from list 
app.delete('/users/:id/:movieTitle', (req, res) =>{
    const { id, movieTitle } = req. params; 

    let user = users.find(user => user.id === id);

    if (user){
      user.favortieMovies =  user.favortieMovies.filter( title !== movieTitle);
      res.status(200).send(`${movieTitle} has been removed from user ${id}'s array`);;
  } else {
      res.status(400).send('movie not found') 
  }
})

// DELETE 4. delete user account
app.delete ('/users/:id', (req, res) =>{
  const { id } = req. params; 

  let user = users.find (user => user.id === id);

  if (user){
    users=  users.filter ( user => user.id != id);
    res.status(200).send (`user ${id}' has been deleted`);
} else {
    res.status(400).send('User not found') 
}
})


  // 1. first step log  in termnal npm run dev meaning to make sure everytime you save file its logged
//READ : to return a list of all the movie to user  READ endpoint
app.get ('/movies', (req, res) =>{
res.status(200).json(movie); //meaning good but best practice to check dev.mozilla.org for http response status codes
})


//READ : to return data about a single momvie called by title 
app.get ('/movies/:title', (req, res) =>{
const { title } = req. params; 
const movie = movies.find (movie => movie.Title === title);

    if (movie){
        res.status(200).json(movie);
    } else {
        res.status(400).send('Movie not found') // remember http status code
    }
})


//READ : to return data about a genre of a movie 
app.get ('/movies/genre/: genreName', (req, res) =>{
const { genreName } = req. params; 
const genre = movies.find (movie => movie.Genre.Name === genreName).Genre; 
// without this last .Genre calling you'd get the whole description

    if (genre){
        res.status(200).json(genre);
    } else {
        res.status(400).send('No such genre')
    }
})

//READ : to return data with director's name 
app.get ('/movie/director/:directorName', (req, res) =>{
const { directorName } = req. params; 
const director = movies.find (movie => movie.Director.Name === directorName).Director; 

    if (director){
        res.status(200).json(director);
    } else {
        res.status(400).send('No such director') 
    }
})



app.get('/', (req, res) => {
res.send('Sit back, relax and enjoy the show!');
});

app.get('/documentation', (req, res) => {                  
res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
res.json(topMovies);
});

app.get('/', (req, res) => {
res.send('Welcome to my app!');
});

app.get('/secreturl', (req, res) => {
res.send('This is a secret url with super top-secret content.');
});


//app.use(express.static('public')); 


 app.use((err, req, res, next) => {
  console.error(err.stack); // logs info in terminal
  res.status(500).send('Something broke!');
});


// listen for requests
app.listen(8080, () =>{
  console.log('Your app is listening on port 8080.');
});


