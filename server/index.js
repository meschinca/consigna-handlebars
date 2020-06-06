// Módulos de Node
const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const fs = require("fs");

const app = express();

// Puerto
const port = 3003;

// Middleware
app.use(express.static(path.join(__dirname, "/public")));

// **********************************************************************
// Configuraciones de Handlebars como motor de vistas

// Seteamos que el motor es handlebars
app.set("view engine", "handlebars");

// Configuramos ese motor y le seteamos el layout default y su ubicación
app.engine("handlebars", exphbs({
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "views/layout")
}));

// Seteamos la ruta de las vistas
app.set("views", path.join(__dirname, "views"));
// **********************************************************************

// Get a ruta raiz
app.get("/", (req, res) => { res.render("home"); });
// Get a Home
app.get("/home", (req, res) => { res.render("home"); });

// GET a /movie-list 
app.get("/movie-list", (req, res) => {

  // Obtenemos la lista de películas desde el archivo json
  let movieList = [];
  getMovieList((data) => {
    movieList = data;
    console.log(movieList);
    // Muestro la vista de lista de películas y le paso el objeto lista de películas para el renderizado
    res.render("movie-list", {
      movie: movieList
    });
  });
})

// GET a /movie-detail/:id 
app.get("/movie-detail/:id", (req, res) => {

  console.log(`Request a /movie-detail/${req.params.id}`);

  // Obtenemos la lista de películas desde el archivo json
  let movieList = [];
  getMovieList((data) => {
    movieList = data;

    // Buscamos la película consultada (para simplificar es una consulta sincrónica)
    const pickedMovie = movieList.find(item => item.id == req.params.id);

    // Respondemos renderizando la vista movie-detail con la película elegida
    res.render("movie-detail", {
      movie: pickedMovie
    });
  });
})

/**
 * Función que consulta la lista de películas
 * 
 * @param {function} cb Callback para recibir resultados como parámetro
 */
function getMovieList(cb) {

  fs.readFile(path.join(__dirname, "movie-list.json"), "utf-8", (err, data) => {
    if (err) {
      console.log("No se pudo leer el archivo.");
      cb([]);
    } else {
      cb(JSON.parse(data));
    }
  })
}



app.listen(port, () => { console.log(`Servidor iniciado. http://localhost:${port}`); });
