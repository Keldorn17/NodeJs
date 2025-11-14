const bcrypt = require("bcrypt");
const userRepo = require("../repository/userRepository");

const saltRounds = 10;

async function registerUser(username, password, password2) {
    const errors = {};
    const formValues = { username };

    if (password !== password2) {
        errors.password2 = "A két jelszó nem egyezik.";
        return { errors, formValues };
    }

    const existing = await userRepo.findByUsername(username);
    if (existing) {
        errors.username = "Ez a felhasználónév már foglalt.";
        return { errors, formValues };
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const newUserId = await userRepo.createUser(username, hash);

    return {
        user: { id: newUserId, username, role: "registered" },
        errors: null,
        formValues
    };
}

async function loginUser(username, password) {
    const user = await userRepo.findByUsername(username);

    if (!user) {
        return { error: "Hibás felhasználónév vagy jelszó.", user: null };
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return { error: "Hibás felhasználónév vagy jelszó.", user: null };
    }

    return { user, error: null };
}

module.exports = { registerUser, loginUser };
