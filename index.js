const express = require('express');
const app = express();
const dotenv = require('dotenv')
const cors = require("cors");

const authRouter = require("./routes/authRoute");
const usersRouter = require("./routes/usersRoute");

// for env file configuration
dotenv.config();

// middlewares
app.use(express.json());
app.use(cors());

// api routes
app.use('/', (req, res) => {
    res.send({ success: true, message: "Welcome to homepage" });
})
app.use('/auth', authRouter);
app.use('/api/v1', usersRouter);
app.use("*", (req, res) => {
    res.status(404).send({ success: false, message: "Api Route Not Found" });
})

// listener
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Port is listening on @ ${PORT}`)
})