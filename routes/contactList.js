const express = require('express');
const router = express.Router();
const contactService = require("../service/contactService");

router.get('/', async function (req, res, next) {
    const contactMessages = await contactService.getContactMessages();
    console.log(contactMessages);
    res.render('contact-list', {
        title: 'Kapcsolat',
        user: req.session.user,
        activePage: "contact",
        contactMessages
    });
});

module.exports = router;
