const isPermission = (req, res, next) => {
  // checking permissions
  if (!(req.user.role === "Admin" || req.user.role === "Support")) {
    return res
      .status(403)
      .send({
        success: false,
        message: "You are not allowed to perform the action",
      });
  } else {
    next();
  }
};

module.exports = isPermission;
