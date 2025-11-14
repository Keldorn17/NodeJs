const express = require("express");
const router = express.Router();
const dbListService = require("../service/animalsService");

router.get("/", async (req, res) => {
    try {
        const animals = await dbListService.listAnimals();

        res.render("animals", {
            title: "Adatbázis",
            user: req.session.user,
            animals
        });
    } catch (err) {
        console.error("DB List error:", err);
        res.status(500).send("Hiba történt az adatok lekérésekor.");
    }
});

module.exports = router;