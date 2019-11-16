const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User Model
const User = require('../models/user');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // Match User
            User.findOne({ email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'Email or password is incorrect or user is not verified' });
                    }

                    bcrypt.genSalt(10)
                        .then(salt => bcrypt.hash(user._id.toString(), salt))
                        .then(hash => {
                            // Set password
                            if (!user.authToken) {
                                user.authToken = hash;
                            }

                            //Save User
                            user.save()
                                .then(user => {
                                    // Match password
                                    bcrypt.compare(password, user.password, (err, success) => {
                                        if (success) {
                                            return done(null, user);
                                        } else {
                                            return done(null, false, { message: 'Email or password is incorrect' });
                                        }
                                    });
                                })
                        })
                        .catch(err => console.log(err));
                })
        }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}