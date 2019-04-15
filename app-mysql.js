/** START Import Module NodeJs **/
const express = require('express'), // Modele de routing - Permet la gestion les routes.
    bodyParser = require('body-parser'), // Middleware - Permet de parser les données envoyer par l'utilisateur et de les traiter de manière facile.
    app = express(),
    mysql = require("mysql"),
    bdd = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'zoubidasql'
    }); // Initialisation de la base de donnée
const fs = require('fs')
/** END Import Module NodeJs **/

bdd.connect(); // Connection à la base de donnée MySql

const urlencodedParser = bodyParser.urlencoded({ extended: false }) // Middleware - Il ce declache avant le lancenement de la function (Pour notre cas, avanc les fonction lier au route pour parser les data envoyer par le client)

const path = __dirname + "/index.html"



/** START Création de route sous express NodeJs **/

//Route par défaut
app.get('/', function(req, res) { // Création d'un route sous express
    if(fs.existsSync(path)){
        //res.writeHead(200, { "content-type": "text/plain;" })
        res.sendFile(__dirname + "/index.html"); // Afficher la page index.html cote client
    }else{
        res.writeHead(404, { "content-type": "text/plain;" })
        res.end("Page not found" )
    }
})
///////////////////////////////////////////////////////////////////////////////////////////////////////////

//Route pour le Login
app.post('/login', urlencodedParser, function(req, res) {

    let retour = {
        error: false,
        message: []
    }

    if (req.body.mail !== undefined || req.body.mail.trim() != "" && req.body.password !== undefined || req.body.password.trim() != "") {
        bdd.query("SELECT * as exist FROM users WHERE email like '" + req.body.email + "' AND password like '" + req.body.password + "';", function(error, result) { // Lancement de la requet SQL
            if (error)
                throw error;
            if(result.lenght == 0){
                retour.error = true;
                retour.message.push("votre email ou password est erroné")
                res.writeHead(401, { "content-type": "application/json; charset=utf-8" })
                res.end(JSON.stringify(retour))
            }else{
                retour.error = false;
                retour.message.push("L'utilisateur a été authentifié succès")
                res.writeHead(201, { "content-type": "application/json; charset=utf-8" })
                res.end(JSON.stringify(result))
            }
        })
    }

    if (req.body.mail === undefined || req.body.mail.trim() == "" || req.body.password === undefined || req.body.password.trim() == "") {
        retour.error = true;
        retour.message.push("l'email/password est manquant")
    }

    if (retour.error == true && (retour.message == "l'email/password est manquant" || retour.message == "Votre email ou password est erroné")) {
        res.writeHead(401, { "content-type": "application/json; charset=utf-8" })
        res.end(JSON.stringify(retour))
    }

    if (retour.error == true && retour.message == "Trop de tentative sur l'email XXXXX - Veuillez patientez 1h") {
        res.writeHead(409, { "content-type": "application/json; charset=utf-8" })
        res.end(JSON.stringify(retour))
    }

})
////////////////////////////////////////////////////////////////////////////////////////

//Route pour le register
app.post('/login', urlencodedParser, function(req, res){
    
    let retour = {
        error: false,
        message: []
    }

})

////////////////////////////////////////////////////////////////////////////////////////

//Route pour la récupération du token utilisateur

////////////////////////////////////////////////////////////////////////////////////////

//Route pour la modification du token utilisateur

////////////////////////////////////////////////////////////////////////////////////////

//Route pour la récupération des utilisateurs

////////////////////////////////////////////////////////////////////////////////////////

//Route pour la déconexion d'un utilisateur

////////////////////////////////////////////////////////////////////////////////////////

//Route pour la sauvegarde d'un evenement

////////////////////////////////////////////////////////////////////////////////////////

/** END Création de route sous express NodeJs **/

app.listen(8080, function() { // Lancement du serveur sur un port
    console.log('Serv run') // http://localhost:8080
})