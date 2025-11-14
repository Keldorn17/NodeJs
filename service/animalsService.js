const dbListRepository = require("../repository/animalsRepository");

async function listAnimals() {
    return await dbListRepository.getAnimalList();
}

module.exports = { listAnimals };