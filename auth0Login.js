const auth0 = require('auth0');

class Auth0Login {
    
    constructor(domain, clientId){
        this.clientId = clientId;
        this.domain = domain;
    }

    login(email, password, done){
        var authClient = new auth0.AuthenticationClient({
            domain: "pkr.auth0.com",
            clientId: "1wdVlMJc3FoS2qkaP8ryqm5E1uRviEMe",
        });
        authClient.database.signIn({
            username: email,
            password: password,
            connection: "local"
        })
        .then(data=>{
            authClient.getProfile(data.access_token)
            .then(json=>{
                done(null,JSON.parse(json))
            });
        })
        .catch(err=>done(err))

    }
}

module.exports = Auth0Login;