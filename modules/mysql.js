let mysql = require("mysql"),
    bdd = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'projet',
    });

bdd.connect(); // Connection à la base de donnée MySql

bdd.convertTokenbyId = function(token) {
    return new Promise(function(resolve, reject) {
        bdd.query("SELECT id FROM token WHERE token = '" + token + "'", function(err, result) {
            let reponse = {}
            reponse.error = (err | result == null) ? true : false
            reponse.data = result;
            resolve(reponse)
        })
    })
}

bdd.registerUser = function(user) {
    return new Promise(function(resolve, reject) {
        bdd.query('insert into user set ?', user, function(err,result){
            let token = Math.random().toString(36).substr(2);
            let theToken = {
                token: token,
                id: result.insertId
            }
            bdd.query('insert into token set ?', theToken, function(err,result){
                let reponse = {}
                reponse.error = (err | result == null) ? true : false
                reponse.data = {
                    name: user.name,
                    token: token
                };
                resolve(reponse)
            });
        })
    })
}

exports.mysql = bdd