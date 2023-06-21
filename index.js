const express = require('express');
const app = express();
const dotenv = require('dotenv')
const cors = require("cors");
const session = require('express-session')
const authRouter = require("./routes/authRoute");
const usersRouter = require("./routes/usersRoute");
const passport = require('passport');
const { localStrategy } = require('./config/passport');

// env file configuration
dotenv.config();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));


// session store in postgresql database
const store = new (require('connect-pg-simple')(session))({
    createTableIfMissing: true
})

// session configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 2 * 60 * 100 * 1000,
        sameSite: "lax",
        httpOnly: true
    }
}))

// passport configuration
app.use(passport.authenticate('session'));
localStrategy(passport);
// googleStrategy(passport);


// api routes
app.use('/auth', authRouter);
app.use('/api/v1', usersRouter);
app.use('/', (req, res) => {
    res.send({ success: true, message: 'Welcome to Express Prisma App' });
})

// not found handling middleware
app.use("*", (req, res) => {
    res.status(404).send({ success: false, message: "Api Route Not Found" });
})

// error handling middleware
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
