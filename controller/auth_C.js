const db = require('../config/db_config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function register(req, res) {
    try {
        const { name, email, userName } = req.body; 
        const hashPass = req.pass; 


        const sql = "INSERT INTO users (name, email, userName, pass) VALUES (?, ?, ?, ?)";
        await db.query(sql, [name, email, userName, hashPass]);

        res.status(201).json({ message: "נרשם בהצלחה" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function login(req, res) {
    try {
        const { userName, pass } = req.body;


        const sql = "SELECT * FROM users WHERE userName = ?";
        const [users] = await db.query(sql, [userName]);

        if (users.length === 0) {
            return res.status(400).json({ message: "משתמש לא קיים" });
        }

        const user = users[0];
        const match = await bcrypt.compare(pass, user.pass);

        if (!match) {
            return res.status(400).json({ message: "סיסמה לא נכונה" });
        }

        const token = jwt.sign(
            { id: user.id, userName: user.userName }, 
            process.env.SECRET_KEY, 
            { expiresIn: '1h' }
        );

        res.cookie('jwt', token, { httpOnly: true });
        res.status(200).json({ message: "התחברת בהצלחה" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

async function logout(req, res) {
    res.clearCookie('jwt');
    res.status(200).json({ message: "התנתקת בהצלחה" });
}

module.exports = { register, login, logout };
