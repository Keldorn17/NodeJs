const repo = require("../repository/adminRepository");

async function listCategories() {
    return await repo.getAllCategories();
}

async function createNewCategory(name) {
    if (!name || name.trim() === "") {
        throw new Error("A kategória neve nem lehet üres.");
    }
    await repo.createCategory(name);
}

async function editCategory(id, name) {
    if (!name || name.trim() === "") {
        throw new Error("A kategória neve nem lehet üres.");
    }
    await repo.updateCategory(id, name);
}

async function removeCategory(id) {
    await repo.deleteCategory(id);
}

async function getCategory(id) {
    return await repo.getCategoryById(id);
}

module.exports = {
    listCategories,
    createNewCategory,
    editCategory,
    removeCategory,
    getCategory
};