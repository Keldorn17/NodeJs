const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/list", async (req, res) => {
    const [rows] = await db.query(`
        SELECT allat.id,
               allat.nev     AS allat_nev,
               allat.ev      AS felfedezes_ev,
               kategoria.nev AS kategoria,
               ertek.forint  AS ertek
        FROM allat
                 JOIN kategoria ON allat.kategoria_id = kategoria.id
                 JOIN ertek ON allat.ertek_id = ertek.id
        ORDER BY allat.nev;
    `);

    res.render("db", {
        title: "Adatbázis",
        user: req.session.user,
        animals: rows
    });
});

module.exports = router;