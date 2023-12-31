const express = require('express');
const app = express();
const dotenv = require('dotenv')
const cors = require("cors");
const session = require('express-session')
const authRouter = require("./routes/authRoute");
const usersRouter = require("./routes/usersRoute");
const passport = require('passport');
const { localStrategy } = require('./config/passport');
const { FRONT_END_URL } = require('./config/URL');


// env file configuration
dotenv.config();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: FRONT_END_URL,
    credentials: true,
}));


// session store in postgresql database
const store = new (require('connect-pg-simple')(session))({
    createTableIfMissing: true
})

// session configuration
app.set('trust proxy', 1)
app.use(session({
    secret: process.env.SESSION_SECRET,
    store,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 2 * 60 * 100 * 1000,
        sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
        httpOnly: process.env.NODE_ENV === 'development' ? true : false,
        secure: process.env.NODE_ENV === 'development' ? false : true,
        signed: true
    }
}))

// passport configuration
app.use(passport.authenticate('session'));
localStrategy(passport);


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
