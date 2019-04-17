let mysql = require('mysql'),
    bdd = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'project'
    })
bdd.connect();

bdd.registerUser = (user) => {
    return new Promise((resolve, reject) => {
        bdd.query('INSERT INTO user SET ?', user, (err, res) => {
            let token = Math.random().toString(36).substr(2)
            bdd.query("INSERT INTO token (token, refresh-token, revoquer, user_id) VALUES ('"+token+"', '2019-01-01', 0, '"+user.user_id+"');", (err, res) => {
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
}

exports.mysql = bdd