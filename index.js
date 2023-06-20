const express = require('express');
const app = express();
const dotenv = require('dotenv')
const cors = require("cors");
const session = require('express-session')
const authRouter = require("./routes/authRoute");
const usersRouter = require("./routes/usersRoute");
const cookieParser = require('cookie-parser');


// for env file configuration
dotenv.config();

// middlewares


app.use(cors({
    origin: 'http://127.0.0.1:5173',
    credentials: true,
}));



// app.use(cookieParser("SecretKey"));
// app.use((req, res, next) => {
//     console.log(req.signedCookies['auth'], 'signedCookies')
//     next();
// })



// app.use(cookieParser("SecretKey"));
app.use(session({
    secret: "SecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 2 * 60 * 100 * 1000,
        sameSite: "none",
        signed: true,
        secure: true
    }
}))

app.use((req, res, next) => {

    console.log(req.session.isLoggedIn, 'isLoggedIn')
    console.log(req.session.user, 'user')
    next();
})

app.use(express.json());


// api routes

app.use('/auth', authRouter);
app.use('/api/v1', usersRouter);
app.use('/', (req, res) => {
    res.send({ success: true, message: "Welcome to homepage" });
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
    console.log(`Port is listening on @ ${PORT}`)
})