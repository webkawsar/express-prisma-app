const express = require('express');
const app = express();
const dotenv = require('dotenv')


const authRouter = require("./routes/authRoute");
const usersRouter = require("./routes/usersRoute");

// for env file configuration
dotenv.config();

// middlewares
app.use(express.json());

// api routes
app.use('/auth', authRouter);
// app.use('/users', usersRouter);
app.use("*", (req, res) => {
    res.send({ success: false, message: "Not Found" });
})

// listener
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Port is listening on @ http://localhost:${PORT}`)
})