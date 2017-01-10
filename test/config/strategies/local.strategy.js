var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongodb = require('mongodb').MongoClient;

module.exports = function(){
  passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'
  },
    function(username, password, done){
        var url = 'mongodb://localhost:27017/timesheet';
      
        mongodb.connect(url, function(err, db){
            if(err){
                console.log(err);
                return done(err);
            }
            var collection = db.collection('users');
            
            collection.findOne({
                            username: username
                        },
                        function(err, user){
                            if(err){
                                return done(err);
                            }
                            if(!user){
                                return done(null, false, {message: 'User not exists'});
                            }
                            if(user.password != password){
                                return done(null, false, {message: 'Passwor d invalid'});
                            }
                            return done(null, user);
                        }
            );
        });
    }));  
};