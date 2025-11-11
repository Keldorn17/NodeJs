const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

router.get("/register", (req, res) => {
    res.render("register", { errors: {}, form: {}, title: "Regisztráció" });
});

router.post("/register", async (req, res) => {
    const { username, password, password2 } = req.body;

    const errors = {
        username: null,
        password: null,
        password2: null,
        global: null
    };

    if (password !== password2) {
        errors.password2 = "A jelszavak nem egyeznek!";
    }

    if (
        !(password.length >= 8 &&
            /[a-z]/.test(password) &&
            /[A-Z]/.test(password) &&
            /\d/.test(password))
    ) {
        errors.password = "A jelszónak legalább 8 karakterből kell állnia, és tartalmaznia kell kisbetűt, nagybetűt és számot.";
    }

    const [exists] = await db.query("SELECT id FROM users WHERE username = ?", [username]);
    if (exists.length > 0) {
        errors.username = "Ez a felhasználónév már foglalt!";
    }

    if (errors.username || errors.password || errors.password2) {
        return res.render("register", { errors, form: { username }, title: "Regisztráció" });
    }

    const hash = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hash]);

    res.redirect("/login");
});


router.get("/login", (req, res) => {
    const logout = req.query.logout === "true";
    res.render("login", { error: null, form: {}, title: "Login", logout: logout });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);

    if (rows.length === 0) {
        return res.render("login", {
            title: "Bejelentkezés",
            error: "Hibás felhasználónév vagy jelszó.",
            form: { username }
        });
    }

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
        return res.render("login", {
            title: "Bejelentkezés",
            error: "Hibás felhasználónév vagy jelszó.",
            form: { username }
        });
    }

    req.session.user = { id: user.id, username: user.username, role: user.role };
    res.redirect("/");
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect("/login?logout=true");
    });
});

module.exports = router;
