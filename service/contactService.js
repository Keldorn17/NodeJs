const contactRepository = require("../repository/contactRepository");

async function getContactMessages() {
    return await contactRepository.findAll();
}

function validateContactMessage(name, email, message) {
    const errors = [];
    if (!name || name.trim() === '') {
        errors.push('A név megadása kötelező.');
    }
    if (!email || !email.includes('@')) {
        errors.push('Érvényes email cím szükséges.');
    }
    if (!message || message.trim().length < 10) {
        errors.push('Az üzenetnek legalább 10 karakter hosszúnak kell lennie.');
    }
    return errors;
}

async function saveContactMessage(name, email, message) {
    await contactRepository.createContactMessage(name, email, message);
}

module.exports = {
    getContactMessages,
    validateContactMessage,
    saveContactMessage
};