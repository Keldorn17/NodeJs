const express = require("express");
const router = express.Router();
const service = require("../service/adminService");

router.get("/", async (req, res) => {
    const categories = await service.listCategories();
    res.render("categories", {
        title: "CRUD – Kategóriák",
        categories,
        user: req.session.user
    });
});

router.get("/create", (req, res) => {
    res.render("adminForm", {
        title: "Új kategória",
        buttonText: "Létrehozás",
        action: "/admin/create",
        category: {},
        user: req.session.user
    });
});

router.post("/create", async (req, res) => {
    try {
        await service.createNewCategory(req.body.nev);
        res.redirect("/admin");
    } catch (err) {
        res.render("adminForm", {
            title: "Új kategória",
            buttonText: "Létrehozás",
            action: "/crud/admin/create",
            category: { nev: req.body.nev },
            error: err.message,
            user: req.session.user
        });
    }
});

router.get("/edit/:id", async (req, res) => {
    const category = await service.getCategory(req.params.id);

    res.render("adminForm", {
        title: "Kategória módosítása",
        buttonText: "Mentés",
        action: `/admin/edit/${req.params.id}`,
        category,
        user: req.session.user
    });
});

router.post("/edit/:id", async (req, res) => {
    try {
        await service.editCategory(req.params.id, req.body.nev);

        res.redirect("/admin");
    } catch (err) {
        res.render("adminForm", {
            title: "Kategória módosítása",
            buttonText: "Mentés",
            action: `/admin/edit/${req.params.id}`,
            category: { id: req.params.id, nev: req.body.nev },
            error: err.message,
            user: req.session.user
        });
    }
});

router.get("/delete/:id", async (req, res) => {
    await service.removeCategory(req.params.id);
    res.redirect("/admin");
});

module.exports = router;