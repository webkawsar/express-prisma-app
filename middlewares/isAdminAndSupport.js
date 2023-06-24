const prisma = require("../lib/prisma");

const isAdminAndSupport = async (req, res, next) => {
  const { userId } = req.params;

  try {
    // checking user exists or not
    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User doesn't exists" });
    }

    // checking permission
    if (req.user?.role === "User" && req.user?.id !== user.id) {
      return res.status(403).send({
        success: false,
        message: "You are not allowed to perform the action",
      });
    }

    if (
      req.user?.role === "Support" &&
      (user.role === "Admin" ||
        (user.role === "Support" && req.user?.id !== user.id))
    ) {
      return res.status(403).send({
        success: false,
        message: "You are not allowed to perform the action",
      });
    }

    next();
    
  } catch (error) {
    next(error);
  }
};

module.exports = isAdminAndSupport;
