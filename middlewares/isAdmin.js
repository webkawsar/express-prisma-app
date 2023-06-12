const isAdmin = (req, res, next) => {
    if (req.user.role === "Admin") {
        next();
    } else {
        res.status(403).send({ success: false, message: "You are not allowed to perform the action" });
    }
};

module.exports = isAdmin;
