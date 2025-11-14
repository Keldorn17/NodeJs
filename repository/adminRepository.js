const db = require("../config/db");

async function getAllCategories() {
    const [rows] = await db.query("SELECT * FROM kategoria ORDER BY nev");
    return rows;
}

async function getCategoryById(id) {
    const [rows] = await db.query("SELECT * FROM kategoria WHERE id = ?", [id]);
    return rows[0] || null;
}

async function createCategory(name) {
    await db.query("INSERT INTO kategoria (nev) VALUES (?)", [name]);
}

async function updateCategory(id, name) {
    await db.query("UPDATE kategoria SET nev = ? WHERE id = ?", [name, id]);
}

async function deleteCategory(id) {
    await db.query("DELETE FROM kategoria WHERE id = ?", [id]);
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};