function requireAdmin(req, res, next) {
    if (!req.session.user || req.session.user.role !== "admin") {
        return res.status(403).render("error/403", {
            title: "Hozzáférés megtagadva",
            user: req.session.user
        });
    }
    next();
}

function requireAuth(req, res, next) {
    if (!req.session.user) {
        return res.status(403).render("error/403", {
            title: "Hozzáférés megtagadva",
            user: req.session.user
        });
    }
    next();
}

module.exports = { requireAdmin, requireAuth };