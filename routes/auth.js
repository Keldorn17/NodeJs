const express = require("express");
const router = express.Router();
const authService = require("../service/authService");

router.get("/register", (req, res) => {
    res.render("register", { errors: {}, form: {}, title: "Regisztráció" });
});

router.post("/register", async (req, res) => {
    const { username, password, password2 } = req.body;

    try {
        const { user, errors, formValues } = await authService.registerUser(username, password, password2);

        if (errors) {
            return res.render("register", {
                error: errors.username || errors.password2,
                form: formValues
            });
        }

        req.session.user = user;
        req.session.isLoggedIn = true;
        res.redirect("/");
    } catch (err) {
        console.error("Registration error:", err);
        res.render("register", {
            error: "Hiba történt a regisztráció során. Kérjük, próbáld újra később.",
            form: { username }
        });
    }
});

router.get("/login", (req, res) => {
    const logout = req.query.logout === "true";
    res.render("login", { error: null, form: {}, title: "Login", logout });
});

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const { user, error } = await authService.loginUser(username, password);

    if (error) {
        return res.render("login", { title: "Bejelentkezés", error, form: { username } });
    }

    req.session.user = { id: user.id, username: user.username, role: user.role };
    res.redirect("/");
});

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.redirect("/auth/login?logout=true");
    });
});

module.exports = router;
