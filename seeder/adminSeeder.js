const bcrypt = require("bcrypt");
const db = require("../config/db");
require("dotenv").config();

async function ensureAdminExists() {
    try {
        const [rows] = await db.query(
            "SELECT id FROM users WHERE role = 'admin' LIMIT 1"
        );

        if (rows.length > 0) {
            console.log("Admin user already exists.");
            return;
        }

        const username = process.env.ADMIN_USERNAME || "admin123";
        const plainPassword = process.env.ADMIN_PASSWORD || "admin123";
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        await db.query(
            "INSERT INTO users (username, password, role) VALUES (?, ?, 'admin')",
            [username, hashedPassword]
        );

        console.log("Admin user created");

    } catch (err) {
        console.error("Admin seed failed:", err);
    }
}

module.exports = ensureAdminExists;
