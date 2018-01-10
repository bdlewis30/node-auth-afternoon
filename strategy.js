const Auth0Strategy = require('passport-auth0');
const config = require(`${__dirname}/config.js`);
const {domain, clientID, clientSecret, scope} = config;

module.exports = new Auth0Strategy({
    domain: domain,
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: '/login',
    scope: scope
},
function(accessToken, refreshToken, extraParams, profile, done){
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    return done(null, profile) // Profile has all the information from the user
})
