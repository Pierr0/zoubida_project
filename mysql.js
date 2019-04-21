let mysql = require('mysql'),
    bdd = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'zoubidasql'
    })
bdd.connect();

// ____________________________________________REGISTER________________________________________________
bdd.registerUser = function(user) {
    var DateJour = new Date(Date.now());
    DateJour = DateJour.toLocaleDateString();
    var DateRefresh = new Date(Date.now()+86400000+86400000);
    DateRefresh = DateRefresh.toLocaleDateString();
    //console.log(DateJour);
    return new Promise((resolve, reject) => {
        bdd.query('INSERT INTO users SET ?', user, (errorInsertUser, resInsertUser) => {
            bdd.query("SELECT user_id FROM users WHERE email like '%"+user.email+"%'", (errorSelectUser, resSelectUser) => {
                let token = Math.random().toString(36).substr(2)//TO DO Format definie pour les Token ?
                bdd.query("SELECT count(*) as compter FROM tokens where token = '"+token+"');", (err, resToken) => {
                    console.log(resToken[0].compter);
                    if(resToken[0].compter == 0){
                        bdd.query("INSERT INTO tokens (token, refresh_token, revoquer,createdAt, user_id) VALUES ('"+token+"', '"+DateJour+"', 0,'"+DateRefresh+"', '"+resSelectUser[0].user_id+"');", (err, res) => {
                            var requete = "INSERT INTO tokens (token, refresh_token, revoquer,createdAt, user_id) VALUES ('"+token+"', '"+DateJour+"', 0,'"+DateRefresh+"', '"+resSelectUser[0].user_id+"');";
                            let reponse = {}
                            reponse.error = (err || res == null) ? true : false
                            reponse.message = "L'utilisateur a bien été créé avec succès"
                            reponse.tokens = {
                                token: token,
                                refresh_token: DateRefresh,
                                createdAt: DateJour
                            }
                            resolve(reponse)
                        })
                    }
                })
            })
        })
    })
}

//________________________________________GET USER WITH TOKEN______________________________________
bdd.getToken = (token) => {
    return new Promise((resolve, reject) => {
        bdd.query("SELECT * FROM tokens WHERE token='"+token+"'", (errorSelectToken, resultSelectToken) => {

            if(resultSelectToken == null){
                let reponse = {}
                reponse.error = true
                reponse.message = "Le token envoyez n'existe pas"
                resolve(reponse)
            }else{
                if(resultSelectToken[0].revoquer == 1){ //TO DO ajout d'une condition sur la date : resultSelectToken[0].refresh_token || 
                    let reponse = {}
                    reponse.error = true
                    reponse.message = "votre token n'ai plus valide, veuillez le réinitialiser"
                }
            }
            
            bdd.query("SELECT firstname,lastname,email,date_naissance,sexe,creatd_at FROM users WHERE user_id='"+resultSelectToken[0].user_id+"'", (error, result) => {
                let reponse = {}
                reponse.error = (error | result == null) ? true : false 
                reponse.user = result
                resolve(reponse)
             })
         })
    })
}
//___________________________________________________________________________________________________

bdd.getUserById = (user_id) => {
    return new Promise((resolve, reject) => {
        bdd.query("SELECT * FROM tokens WHERE user_id='"+user_id+"'", (error, result) => {
            if (result == null){
                let reponse = {}
                reponse.error = true
                reponse.message = ""
                reponse.data = result
                resolve(reponse)
            }
            let reponse = {}
            reponse.error = (error | result == null) ? true : false 
            reponse.data = result
            resolve(reponse)
         })
    })
}

bdd.userIdentification = (user) => {
    return new Promise((resolve, reject) => {
        bdd.query("SELECT user_id FROM users WHERE email='"+user.email+"' AND password='"+user.password+"'", (error, result) => {
            if (result == null){
                let reponse = {}
                reponse.error = true
                reponse.message = "Votre email ou password est érroné"
                reponse.data = result
                resolve(reponse)
            }
            let token = Math.random().toString(36).substr(2)
                bdd.query("INSERT INTO tokens (token, refresh_token, revoquer,createdAt, user_id) VALUES ('"+token+"', '2019-01-01', 0,'2019-01-01', '"+result[0].user_id+"');", (err, res) => {
                    let reponse = {}
                    reponse.error = (err || res == null) ? true : false
                    reponse.data = {
                        token: token,
                        refresh_token: '2019-01-01',
                        createdAt: '2019-01-01'
                    }
                    resolve(reponse)
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