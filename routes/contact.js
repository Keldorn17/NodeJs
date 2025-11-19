const express = require('express');
const router = express.Router();
const contactService = require("../service/contactService");

router.get('/', function (req, res, next) {
    res.render('contact', {
        title: 'Kapcsolat',
        user: req.session.user
    });
});

router.post('/submit', async function (req, res, next) {
    const {name, email, message} = req.body;

    const errors = contactService.validateContactMessage(name, email, message);

    if (errors.length > 0) {
        return res.render('contact', {
            title: 'Kapcsolat',
            error: errors[0],
            input: {name, email, message},
            user: req.session.user
        });
    }

    try {
        await contactService.saveContactMessage(name, email, message);
        return res.render('contact', {
            title: 'Kapcsolat',
            success: true,
            user: req.session.user
        });
    } catch (err) {
        console.error(err);
        return res.render('contact', {
            title: 'Kapcsolat',
            error: 'Nehézségek akadtak a mentéssel. Kérjük próbálja újra később.',
            input: {name, email, message},
            user: req.session.user
        });
    }


});

module.exports = router;
