
const protect = async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res
      .status(401)
      .send({ success: false, message: "Please login to perform the action" });
  }
};

module.exports = protect;
