const protect = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.send({ success: false, message: "You are not allowed to perform the action" });
    }
};

module.exports = protect;
