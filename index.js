const express = require('express');
const session = require('express-session');
const passport = require('passport');
const dotenv = require('dotenv')
dotenv.config()
require('./auth')

function isLoggedIn(req, res, next){
    req.user ? next() : res.sendStatus(401)
}

const app = express();
app.use(session({secret: "cats"}))
app.use(passport.initialize())
app.use(passport.session())

app.get("/", (req, res) => {
    res.status(200).send('<a href="/auth/google">Authenticate with Google</a>')
});

app.get("/auth/google", 
    passport.authenticate('google',{scope:['email','profile'] })
);

app.get("/google/callback",
    passport.authenticate('google',{
        successRedirect: '/dashboard',
        failureRedirect: '/auth/failure',
    })
);

app.get("/auth/failure", (req, res) => {
    res.status(500).send('something went wrong...')
});

app.get("/dashboard", isLoggedIn, (req, res) => {
    res.status(200).send(`Welcome to Dashboard ${req.user.displayName}, Email: ${req.user.email} , 
    Image:<img src='${req.user.picture}' alt='${req.user.picture}'>`)
});

// app.get("/logout", (req, res) => {
//     res.logout()
//     res.destroy()
//     res.send('Goodbye!')
// });

const port = process.env.PORT || 3000

app.listen(port, ()=>{
    console.log(`connected to backend - ${port}`);
});