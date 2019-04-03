/** START Import Module NodeJs **/
const express = require('express'),
    bcryptjs = require('bcryptjs'),
    mysql = require('./modules/mysql.js').mysql,
    bodyParser = require('body-parser'),
    app = express(),
    jsonParser = bodyParser.urlencoded({ extended: false });
/** END Import Module NodeJs **/

app.get('/test/:token', function(req, res) {
    mysql.convertTokenbyId(req.params.token).then(function(data) {
        console.log(data)
        res.end(JSON.stringify(data))
    })
})

app.post('/register', jsonParser, function(req,res){
    if(req.body.name === undefined || req.body.name.trim() == ""){
        res.end(JSON.stringify({
            error : true,
            message: "Not user nom"
        }))
    }else if(req.body.email === undefined || req.body.email.trim() == ""){
        res.end(JSON.stringify({
            error : true,
            message: "Not user email"
        }))
    }else if(req.body.password === undefined || req.body.password.trim() == ""){
        res.end(JSON.stringify({
            error : true,
            message: "Not user password"
        }))
    }else{
        let user = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
        mysql.registerUser(user).then(function(data){
            res.end(JSON.stringify(data));
        })
    }
})

app.listen(8080)