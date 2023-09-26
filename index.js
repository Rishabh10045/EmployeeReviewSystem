// step 1: install the express framework.
const express   = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8001;

const expressLayouts = require('express-ejs-layouts');

const db = require('./config/mongoose');
// used for session cookies...
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport_local_strategy')
const MongoStore = require('connect-mongo')(session);




app.use(express.urlencoded());

app.use(cookieParser());
// to extract the scripts and the style from the sub pages into the layout.
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

app.use(express.static('./assets'));

app.use(expressLayouts);

// set up our views engine..
app.set('view engine','ejs');
app.set('views','./views');


// add a middleware which takes in a session cookies and encryptes it.
// note : order is very important here...

// mongo store is used to store the session cookie in the db.
app.use(session({
    name:'Codiel_Learning_Project',
    // TO DO : change the secret before deployment..
    secret: 'radhe radhe',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000*60*1)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoRemove: 'disabled'
    },
    function(err){
        console.log(err || 'connect-mongodb setup')
    })
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(passport.setAuthenticatedUser);


// middleware for using the express.Router
app.use('/',require('./routes/index.js'));



app.listen(port, function (err) {
    if(err){
        console.log(`Couldn't listen on ${port}`);
    }
    console.log(`App listening on ${port}`);
});