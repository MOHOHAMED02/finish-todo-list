const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function valuesToAdd(req, res, next) {
    let { name, email, userName, pass } = req.body;
    if (!name || !email || !userName || !pass) return res.status(400).json({ message: "Missing data" });
    next();
}

function valuesToLogin(req, res, next) { 
    let { userName, pass } = req.body;
    if (!userName || !pass) return res.status(400).json({ message: "Missing data" });
    next();
}

async function encrypPass(req, res, next) {
    try {
        req.pass = await bcrypt.hash(req.body.pass, 10);
        next();
    } catch (err) { res.status(500).json({ message: "Server error" }); }
}

function isLoggedIn(req, res, next) {
    let token = req.cookies.jwt;
    if (!token) {
        if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return res.redirect('/pages/login.html'); 
        }
        return res.status(401).json({ message: "Please login first" });
    }
    try {
        req.user = jwt.verify(token, process.env.SECRET_KEY);
        next();
    } catch (err) {
        res.clearCookie('jwt');
        if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return res.redirect('/pages/login.html');
        }
        res.status(401).json({ message: "Session expired" });
    }
}


module.exports = { valuesToAdd, encrypPass, valuesToLogin, isLoggedIn };
