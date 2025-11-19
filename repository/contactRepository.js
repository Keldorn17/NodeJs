const db = require("../config/db");

async function findAll() {
    const [rows] = await db.query("SELECT m.name, m.email, m.message, m.created_at FROM messages m ORDER BY created_at DESC");
    return rows;
}

async function createContactMessage(name, email, message) {
    return db.query("INSERT INTO messages (name, email, message) VALUES (?, ?, ?)", [name, email, message]);
}

module.exports = {
    findAll,
    createContactMessage
};