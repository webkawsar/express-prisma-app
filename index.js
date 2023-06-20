const express = require('express');
const app = express();
const dotenv = require('dotenv')
const cors = require("cors");
const session = require('express-session')
const authRouter = require("./routes/authRoute");
const usersRouter = require("./routes/usersRoute");


// for env file configuration
dotenv.config();


// set view engine
app.set("view engine", "ejs");

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));


// session store in database
const store = new (require('connect-pg-simple')(session))({
    createTableIfMissing: true
})

app.use(session({
    secret: process.env.SESSION_SECRET,
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 2 * 60 * 100 * 1000,
        sameSite: "lax",
        httpOnly: true,
    }
}))

app.use((req, res, next) => {

    console.log(req.session.isLoggedIn, 'isLoggedIn')
    console.log(req.session.user, 'user')
    next();
})


// api routes
app.use('/auth', authRouter);
app.use('/api/v1', usersRouter);
app.use('/', (req, res) => {
    res.send({ success: true, message: 'Welcome to Express Prisma App' });
})
app.use("*", (req, res) => {
    res.status(404).send({ success: false, message: "Api Route Not Found" });
})

app.use((error, req, res, next) => {

    console.log(error, 'error');

    res.status(500).send({
        success: false,
        message: "Internal Server Error",
    });
})

// listener
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Port is listening on ${PORT}`)
})
