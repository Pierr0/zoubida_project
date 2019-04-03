/** START Import Module NodeJs **/
const express = require('express'), // Modele de routing - Permet la gestion les routes.
    bodyParser = require('body-parser'), // Middleware - Permet de parser les données envoyer par l'utilisateur et de les traiter de manière facile.
    app = express(),
    mysql = require("mysql"),
    bdd = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'zoubidasql'
    }); // Initialisation de la base de donnée
const fs = require('fs')
/** END Import Module NodeJs **/

bdd.connect(); // Connection à la base de donnée MySql

const urlencodedParser = bodyParser.urlencoded({ extended: false }) // Middleware - Il ce declache avant le lancenement de la function (Pour notre cas, avanc les fonction lier au route pour parser les data envoyer par le client)

const path = __dirname + "/index.html"



/** START Création de route sous express NodeJs **/
app.get('/', function(req, res) { // Création d'un route sous express
if(fs.existsSync(path)){
    res.writeHead(200, { "content-type": "text/plain;" })
    res.sendFile(__dirname + "/index.html"); // Afficher la page index.html cote client
}else{
    res.writeHead(404, { "content-type": "text/plain;" })
    res.end("Page not found" )
}})

/** END Création de route sous express NodeJs **/

app.listen(8080, function() { // Lancement du serveur sur un port
    console.log('Serv run') // http://localhost:8080
})