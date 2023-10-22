const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Models
const User = require('../models/user');
const Company = require('../models/Company')
const Student = require('../models/Student')


const ensureAuth = require('../config/auth');
const { sendEmail } = require('../middlewares/emailService');
const sendMailToPeople = require('../middlewares/sendMailToPeople')

router.get('/login', (req, res) => {
    if (req.user) {
        return res.redirect('/auth/dashboard');
    }
    return res.render('login', { req, next: req.query.next })
});

router.get('/register', (req, res) => {
    if (req.user) {
        return res.redirect('/auth/dashboard');
    }
    return res.render('register', { req })
});

router.get('/forgot', (req, res) => res.render('forgot', { req }));

// Handling registration
router.post('/register', (req, res) => {
    const { name, email, password, password2, phone } = req.body;

        //Validation Passed
        User.findOne({ email })
            .then(user => {
                if (user) {
                    //User exists
                    errors.push({ msg: 'Email is already registered' });
                    return res.render('register', { errors, name, email, password, password2, phone, req });
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password,
                    });

                    // Hash Password
                    bcrypt.genSalt(10)
                        .then(salt => {
                            newUser.verificationToken = salt;
                            return bcrypt.hash(newUser.password, salt);
                        })
                        .then(hash => {

                            // Set password
                            newUser.password = hash;
                            console.log(hash);

                            //Save User
                            newUser.save()
                                .then(user => {
                                    console.log(user);
                                    // sendEmail('support@litstays.com', user.email, `Verify your LitStays Account`, ``, `Click <a href="${req.protocol}://${req.headers.host}/auth/verify?token=${user.verificationToken}">here</a> to verify your account or copy and paste the given link in your browser.<br>${req.protocol}://${req.headers.host}/auth/verify?token=${user.verificationToken}`);
                                    // req.flash('success_msg', 'You are now registered and can login');
                                    // req.flash('success_msg', 'Check your email to verify your account');
                                    // return res.redirect('/auth/login');
                                })
                        })
                        .catch(err => console.log(err));
                }
            })
});

// Handling Login
router.post('/login', (req, res, next) => {
    console.log(req.body)
    passport.authenticate('local', {
        successRedirect: req.query.next ? (req.query.next.startsWith(req.headers.host) ? req.query.next.substring(req.headers.host.length, req.query.next.length) : '/auth/dashboard') : '/auth/dashboard',
        failureRedirect: '/auth/login' + (req.query.next ? `?next=${req.query.next}` : ''),
        failureFlash: false
    })(req, res, next);
});

// Handling Logout
router.get('/logout', function(req, res) {
    req.logout();
    // req.flash('success_msg', 'You are Logged Out');
    res.redirect('/auth/login');
});

// Verification of account
router.get('/verify', (req, res) => {
    var token = req.query.token;
    User.findOneAndUpdate({ verificationToken: token }, { verified: true }, { new: true })
        .then(user => {
            sendEmail('support@litstays.com', user.email, `Welcome to LitStays`, ``, `Whatever`);
            // req.flash('success_msg', 'You are now verified and ready to login');
            return res.redirect('/auth/login')
        })
        .catch(err => console.log(err));
});

router.get('/dashboard', ensureAuth, (req, res) => {
    console.log(req.user);
    console.log('Request for dashboard')    
    res.render('index_admin')
})

router.post('/confirm', ensureAuth, (req, res) => {
    // BODY EXPECTED: {companyId: '', confirm: true/false}
    console.log('Company Permission Request', req.body)
    Company.findByIdAndUpdate(req.body.companyId, {verified: req.body.confirm, acionTaken: true})
        .then(company => {
            sendMailToPeople(company, req.body.confirm);
            res.send('OK')
        })
})

// Changing Password on email link click
router.get('/reset', (req, res) => {
    var token = req.query.token;
    console.log(token);
    User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                // req.flash('error_msg', 'The token is invalid. Try to reset the password again');
                return res.redirect('/auth/forgot');
            }
            return res.render('resetPassword', { req, token });
        })
        .catch(err => console.log(err));
});

// Setting up new password
router.post('/reset', (req, res) => {
    var { password, password2 } = req.body;
    var errors = [],
        token = req.query.token;
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (errors.length > 0) {
        return res.render('resetPassword', { errors, password, password2, req, token });
    }

    var token = req.query.token;
    User.findOneAndUpdate({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } }, { resetPasswordExpires: undefined, resetPasswordToken: undefined }, { new: true })
        .then(user => {
            if (!user) {
                // req.flash('error_msg', 'The token is invalid. Try to reset the password again');
                return res.redirect('/auth/forgot');
            }

            bcrypt.genSalt(10)
                .then(salt => bcrypt.hash(password, salt))
                .then(hash => {
                    user.password = hash;
                    user.save()
                })
                .then(() => {
                    // req.flash('success_msg', 'Password successfully changed. You can now login');
                    return res.redirect('/auth/login');
                });
        })
        .catch(err => console.log(err));
});

// Forgot password
router.post('/forgot', (req, res) => {
    var { email } = req.body;
    var errors = [];
    User.findOne({ email })
        .then(user => {
            if (!user) {
                errors.push({ msg: 'Unable to find an account associated with that email' });
                res.render('forgot', { errors, req, email });
            } else {
                bcrypt.genSalt(10)
                    .then(salt => {
                        user.resetPasswordToken = salt;
                        user.resetPasswordExpires = Date.now() + (1000 * 60 * 60 * 6);
                        return user.save();
                    })
                    .then(() => {
                        sendEmail('support@litstays.com', user.email, `Reset your LitStays Account Password`, ``, `Click <a href="${req.protocol}://${req.headers.host}/auth/reset?token=${user.resetPasswordToken}">here</a> to verify your account or copy and paste the given link in your browser. This link will be valid for 6 hours. <br>${req.protocol}://${req.headers.host}/auth/reset?token=${user.resetPasswordToken}`);
                        // req.flash('success_msg', 'Check your email for the reset link');
                        return res.redirect('/auth/login');
                    });
            }
        })
        .catch(err => {
            // req.flash('error_msg', 'Unable to find an account assocaited with that email');
            // req.flash('error_msg', err);
            res.redirect('/auth/login', { req, email });
        });
});

router.get('/updatestudent', ensureAuth, (req, res) => {
    res.render('updatestudent')
})

router.post('/updateform', ensureAuth, (req, res) => {
    // REQ BODY: {roll: ''}
    console.log(req.body)
    Student.findOne({roll: req.body.roll}).then(student => {
        if(!student) {
            res.send('Student Not Found!')
        } else {
            res.render('updateform', {student})
        }
    })
});

router.get('/showEligibleStudents/:id', ensureAuth, (req, res) => {
    Company.findById(req.params.id)
    .then(company => {
        Student.find({branch: {$in: company.branch}, cgpa : {$gte: company.cgpa}})
        .then(students => {
            console.log(students);
            res.render('student_admin', {req, students})
        })
    })
    .catch(err => console.log(err));
});

router.post('/updatestudent', ensureAuth, (req, res) => {
    // REQ BODY: Entire student object in the form of schema
    console.log(req.body)
    Student.findOneAndUpdate({roll: req.body.roll}, 
        {
            name: req.body.name,
            roll: req.body.roll,
            email: req.body.email,
            contact: req.body.contact,
            pan: req.body.pan,
            placed: req.body.placed,
            company: req.body.company
        }).then(student => {
            console.log(student)
            res.redirect('/student_admin')
        })
        .catch(e => res.send(e))
})

module.exports = router;