const express = require("express");
const session = require("express-session")
const passport = require('passport');
require('./auth')



//function (middeleware) to checks if a user is logged in or not
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401) ;

}

const app = express()
app.use(session({ secret: 'cats' }));
app.use(passport.initialize());
app.use(passport.session())

app.get('/', (req, res)=> {
    res.send('<a href="/auth/google">Authenticate with Google </a>');
})

app.get('/auth/google',
    passport.authenticate('google', {scope: ['email', 'profile'] })
)

app.get('/google/callback',
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/failure'
    })
)

app.get('/auth/failure', (req,res) => {
    res.send('something went wrong.');
})

app.get('/protected', isLoggedIn ,(req, res)=> {
    res.send(`hello ${req.user.displayName}`);
})

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.send('Goodbye');
    });
});

app.listen(5000, ()=> console.log('server listening on: 5000'));