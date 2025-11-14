const db = require("../config/db");

async function findByUsername(username) {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);
    return rows[0] || null;
}

async function createUser(username, hashedPassword) {
    const [result] = await db.query(
        "INSERT INTO users (username, password, role) VALUES (?, ?, 'registered')",
        [username, hashedPassword]
    );
    return result.insertId;
}

module.exports = { findByUsername, createUser };