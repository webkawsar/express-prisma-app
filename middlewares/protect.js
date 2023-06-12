const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

const protect = async (req, res, next) => {

    if(req.headers['authorization']){
        try {

            // accessing token
            const token = req.headers["authorization"].split(" ")[1];

            //verify token
            const decoded = await jwt.verify(token, process.env.ACCOUNT_LOGIN_SECRET);

            // find user and set in req
            const user = await prisma.user.findUnique({
                where: {
                    email: decoded.email
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    role: true,
                    isVerified: true
                }
            });
            req.user = user;
            next();
            
        } catch (error) {

            res.status(401).send({ success: false, message: "Please login to perform the action" });
        }

    } else {
        res.status(401).send({ success: false, message: "No token provided or Unauthorized Access" });
    }
};

module.exports = protect;
