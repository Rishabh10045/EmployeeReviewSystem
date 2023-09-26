const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user')
// authentication using passport
// create authentication function...
passport.use(new LocalStrategy({
    // username field in our schema is unique..
    usernameField: 'email',
    },
    function(email,password,done){
        // email is the username...
        // find the user and establish connection...
        User.findOne({email: email})
        .then(function(user){
            if(!user|| user.password != password){
                console.log('invalid username or password');
                return done(null, false);
            }
            else{
                return done(null, user);
            }
        })
        .catch(function(err){
            console.log('error in finding the user ---> Passport');
            return done(err);
            // done takes 2 arguments... 1. error 2. something else...
        })
    }
));


// serializing the user to decide which key is to kept in the cookies

passport.serializeUser(function(user,done){
    done(null,user.id);
});

// deseialize the user from the key in the cookies...
passport.deserializeUser(function(id,done){
    User.findById(id)
    .then(function(user){
        return done(null , user);
    })
    .catch(function(err){
        console.log('error in finding the user ---> Passport');
        return done(err);
    })
});

// sending the data to ejs file

// check if the user  is authenticated
passport.checkAuthentication = function(req, res, next){
    // if the user is signed in, then pass on the request to the next function(controller's action)
    //  console.log(req.isAuthenticated());
    // console.log('check 1:'+ req.isAuthenticated());
    if(req.isAuthenticated()){
        // if user is sign in the isAuthenticated() return true
        // console.log('from isAuthenticated ->',req.user)
        // console.log(req.isAuthenticated());
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser = function(req, res, next){
    if (req.isAuthenticated()){
        // console.log('from setAuthenticatedUser ->',req.user);
        // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
        res.locals.user = req.user; 
        // console.log('after res.locals.user',res.locals.user);
        //The res.locals is an object that contains the local variables for the response which are scoped to the request only and therefore just available for the views rendered during that request or response cycle.
    }
    next();
}

module.exports = passport;