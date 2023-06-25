const prisma = require("../lib/prisma");

exports.addPermission = (req, res, next) => {
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


exports.editAndDeletePermission = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // checking user exists or not
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId)
      }
    });

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User doesn't exists" });
    }

    // User can update only self data
    if (req.user?.role === "User" && req.user?.id !== user?.id) {
      return res.status(403).send({
        success: false,
        message: "You are not allowed to perform the action"
      });
    }

    // Support user can only update user data and self data
    if (req.user?.role === "Support" && ((user?.role === "Admin" || user?.role === "Support") && req.user?.id !== user?.id)) {
      return res.status(403).send({
        success: false,
        message: "You are not allowed to perform the action"
      });
    }

    // Admin can update all users data
    req.updateUser = user;
    next();
    
  } catch (error) {
    next(error);
  }
};


