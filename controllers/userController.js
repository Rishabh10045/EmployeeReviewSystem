
const User = require('../models/user');
const Review = require('../models/review');



module.exports.create = function(req,res){
    if(req.body.password != req.body.confirm_password){
        return res.redirect('back')
    }

    User.findOne({email: req.body.email})
    .then(function(user){
        if(!user){
            
            User.create({
                name : req.body.name,
                email : req.body.email,
                isAdmin : false,
                password : req.body.password
            })
            .then(function(user){
                return res.redirect('/')
            })
            .catch(function(err){
                console.log("error in creating user while signing up");
                return;
            });
        }else{
            // console.log(user);
            return res.redirect('back');
        }
    })
    .catch(function(err){
        console.log("error in finding user in signing up");
        return;
    })
    
}




module.exports.createSession = function(req, res){
    return res.redirect('/');
}


// module.exports.destroySession = function(req, res,next){
//     // req.logout();
//     // return res.redirect('/users/sign-in');

//     if (req.session) {
//         // delete session object
//         req.session.destroy(function (err) {
//           if (err) {
//             return next(err);
//           } else {
//             return res.redirect('/users/sign-in');
//             // return res.redirect('/');
//           }
//         });
//       }
// }


module.exports.destroySession= function(req, res, next) {
    req.logout(function(err) {
      if (err) { 
        return next(err);
     }
    
    return res.redirect('/users/sign-in');
    //   res.redirect('/');
    });
    
}


// app.get('/logout',  function (req, res, next)  {
//     if (req.session) {
//       // delete session object
//       req.session.destroy(function (err) {
//         if (err) {
//           return next(err);
//         } else {
//           return res.redirect('/');
//         }
//       });
//     }
//   });


module.exports.signIn = function(req, res){
    
    if(req.isAuthenticated()){
        return res.render('home', {
            title : "Home"
        });
    }
    return res.render('user_sign_in', {
        title : "Login"
    });
}



module.exports.signUp = function(req, res){

    if(req.isAuthenticated() && req.user.isAdmin){
        return res.render('user_sign_up', {
            title : "Sign Up"
        });
    }

    if(req.isAuthenticated()){
        return res.render('home', {
            title : "Home"
        });
    }
    
    return res.render('user_sign_up', {
        title : "Sign Up"
    });
    
}

// home
module.exports.home = async function(req, res){

    try {
        // console.log('check 1:'+ req.isAuthenticated());
        if(!req.isAuthenticated()){
            return res.redirect('/users/sign-in');
        }

        let user = await User.findById(req.user.id);
        let review = await Review.find({to : req.user.id});
        

        let recipients = [];

        for(let i = 0; i < user.to.length; i++){
            let x = await User.findById(user.to[i]);
            recipients.push(x);
        }

        // find reviews
        let reviews = [];

        for(let i = 0; i < review.length; i++){
            let x = await User.findById(review[i].from);
            

            let curr_review = {
                name : x.name,
                review : review[i].review,
                updated : review[i].updatedAt,
            };
            reviews.push(curr_review);
        }

        return res.render('home', {
            title : "Home",
            recipients: recipients,
            reviews: reviews,
            user : user,
        });

    }catch(error) {
        console.log(error);
        return;
    }
    
}