let mysql = require('mysql'),
    bdd = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'zoubidasql'
    })
bdd.connect();


bdd.registerUser = function(user) {
    return new Promise((resolve, reject) => {
        bdd.query('INSERT INTO users SET ?', user, (err, res) => {
            bdd.query("SELECT user_id FROM users WHERE email like '%"+user.email+"%'", (err, res) => {
                let token = Math.random().toString(36).substr(2)
                bdd.query("INSERT INTO tokens (token, `refresh-token`, revoquer,createdAt, user_id) VALUES ('"+token+"', '2019-01-01', 0,'2019-01-01', '"+res[0].user_id+"');", (err, res) => {
                    let reponse = {}
                    reponse.error = (err || res == null) ? true : false
                    reponse.data = {
                        name: user.name,
                        token: token
                    }
                    resolve(reponse)
                })
            })
        })
    })
}

/*
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
*/
exports.mysql = bdd