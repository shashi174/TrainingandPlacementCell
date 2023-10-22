const ensureAuth = (req, res, next) => {
    if(req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/auth/login');
    }
}

module.exports = ensureAuth;