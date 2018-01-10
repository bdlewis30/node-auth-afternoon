const express = require('express');
const session = require('express-session');
const passport = require('passport');
const strategy = require(`${__dirname}/strategy.js`);
const request = require('request');

const app = express();
app.use(session({
  secret: '@nyth!ng y0u w@nT',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(strategy);

// The serializeUser and deserializeUser methods get called after a successful login and before the success redirect. 
// you use serializeUser to pick what properties you want from the returned user object and you use deserializeUser to execute any necessary logic on the new version of the user object.
// When you call done(null, {}) in serializeUser the value of that object then becomes the value of the obj parameter in deserializeUser.
passport.serializeUser((user, done) => {
  console.log(user)
  const { _json } = user;
  done(null, { clientID: _json.clientID, email: _json.email, name: _json.name, followers: `https://api.github.com/users/${_json.nickname}/followers` })
})
// Since there is no additional logic to execute, simply call done with null and obj.
passport.deserializeUser((obj, done) => {
  done(null, obj)
})

app.get('/login', passport.authenticate('auth0', { successRedirect: '/followers', failureRedirect: '/login', failureFlash: true, connection: 'github' }))

app.get('/followers', (req, res, next) => {
  if (req.user) {
    const FollowersRequest = {
      url: req.user.followers,
      headers: {
        'User-Agent': 'bdlewis30'
      }
    }
    request(FollowersRequest, (error, response, body) => {
      res.status(200).send(body);
    })
  } else {
    res.redirect('/login')
  }
})

const port = 3000;
app.listen(port, () => { console.log(`Server listening on port ${port}`); });