var createError = require('http-errors');
const session = require("express-session");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { engine } = require("express-handlebars");
const ensureAdminExists = require("./seeder/adminSeeder");
const { requireAdmin, requireAuth } = require("./middleware/auth");
require("dotenv").config();

const indexRouter = require('./routes/index');
const contactRouter = require('./routes/contact');
const contactListRouter = require('./routes/contactList');
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const animalsRoutes = require("./routes/animals");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine("hbs", engine({
    extname: ".hbs",
    helpers: {
        eq: (a, b) => a === b,
        default: (value, fallback) => value ? value : fallback,
        formatDate: (dateString) => {
            if (!dateString) return "";
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('hu-HU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).format(date);
        }
    },
    partialsDir: path.join(__dirname, 'views', 'partials'),
    defaultLayout: "main",
}));

app.set("view engine", "hbs");
app.set("views", "./views");

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const basePath = process.env.BASE_PATH ?? "";
app.use(basePath, express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
    })
);

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});



app.use(basePath + "/", indexRouter);
app.use(basePath + "/auth", authRoutes);
app.use(basePath + "/contact", contactRouter);
app.use(basePath + "/animals", requireAuth, animalsRoutes);
app.use(basePath + "/admin", requireAdmin, adminRoutes);
app.use(basePath + "/contact-list", requireAdmin, contactListRouter);

app.locals.basePath = basePath;

(async () => {
    await ensureAdminExists();
})();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
