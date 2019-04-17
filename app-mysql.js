/** START Import Module NodeJs **/
const express = require('express'), // Modele de routing - Permet la gestion les routes.
    bodyParser = require('body-parser'), // Middleware - Permet de parser les données envoyer par l'utilisateur et de les traiter de manière facile.
    app = express(),
    mysql = require("./modules/mysql.js").mysql;
    const fs = require('fs')
/** END Import Module NodeJs **/
const path = __dirname + "/modules/index.html"

const urlencodedParser = bodyParser.urlencoded({ extended: false }) // Middleware - Il ce declache avant le lancenement de la function (Pour notre cas, avanc les fonction lier au route pour parser les data envoyer par le client)

/** START Création de route sous express NodeJs **/

app.get('/', function(req, res) { // Création d'un route sous express
    if(fs.existsSync(path)){
        //res.writeHead(200, { "content-type": "text/plain;" })
        res.sendFile(__dirname + "/modules/index.html"); // Afficher la page index.html cote client
    }else{
        res.writeHead(404, { "content-type": "text/plain;" })
        res.end("Page not found" )
    }
})

app.post('/register', urlencodedParser, (req, res) => {

    if(req.body.firstname === undefined || req.body.firstname.trim() ==""){
        res.end(JSON.stringify({
            error: true,
            message: "Not user firstname"
        }))
    }else if(req.body.lastname === undefined || req.body.lastname.trim() ==""){
        res.end(JSON.stringify({
            error: true,
            message: "Not user lastname"
        }))
    }else if(req.body.email === undefined || req.body.email.trim() ==""){
        res.end(JSON.stringify({
            error: true,
            message: "Not user email"
        }))
    }else if(req.body.password === undefined || req.body.password.trim() ==""){
        res.end(JSON.stringify({
            error: true,
            message: "Not user password"
        }))
    }else if(req.body.date_naissance === undefined || req.body.date_naissance.trim() ==""){
        res.end(JSON.stringify({
            error: true,
            message: "Not user date_naissance"
        }))
    }else if(req.body.sexe === undefined || req.body.sexe.trim() ==""){
        res.end(JSON.stringify({
            error: true,
            message: "Not user sexe"
        }))
    }else{
        let user = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            date_naissance: req.body.date_naissance,
            sexe: req.body.sexe,
            password: req.body.password,
            email: req.body.email
        }
        mysql.registerUser(user).then((data) => {
            res.end(JSON.stringify(data))
        })

    }
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
//Route pour le Login
app.post('/login', urlencodedParser, function(req, res) {

    let retour = {
        error: false,
        message: []
    }

    if (req.body.mail !== undefined || req.body.mail.trim() != "" && req.body.password !== undefined || req.body.password.trim() != "") {
        bdd.query("SELECT * FROM users WHERE email like '" + req.body.email + "' AND password like '" + req.body.password + "';", function(error, result) { // Lancement de la requet SQL
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

/** END Création de route sous express NodeJs **/

app.listen(8080, function() { // Lancement du serveur sur un port
    console.log('Serv run') // http://localhost:8080
})