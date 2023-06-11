const prisma = require("../lib/prisma")
const _ = require("lodash");



module.exports.getAll = async (req, res) => {
    try {

        // cursor => mane jekoyta take korbe first e, second time e first time er last ta show abar ei koyta take korbe
        // distinct
        // orderBy => sorting er jonno
        // select => mane specific field select kore show kora jabe
        // skip => mane koyta skip kore jabe
        // take => mane koyta dibe
        // where => searching requirements
        // include => relation field kore populate kore show kore

        const users = await prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isVerified: true
            }
        });
        res.send({ success: true, users })
        
    } catch (error) {
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
}

module.exports.getSingle = async (req, res) => {
    try {

        const { userId } = req.params;
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isVerified: true
            }
        })
        res.send({ success: true, user })
        
    } catch (error) {
        
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
}

module.exports.update = async (req, res) => {
    try {

        const { userId } = req.params;

        // picked  necessary data
        const pickedData = _.pick(req.body, [
            "firstName",
            "lastName",
        ]);

        // checking user exists or not
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            }
        })

        if(!user) {
            return res.status(404).send({ success: false, message: "User doesn't exists" });
        }

        // update user
        const updatedUser = await prisma.user.update({
            where: {
                id: Number(userId)
            },
            data: {
                ...pickedData
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isVerified: true
            }
        })

        res.send({ success: true, user: updatedUser })
        
    } catch (error) {
        
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
}

module.exports.delete = async (req, res) => {
    try {

        const { userId } = req.params;

        // checking user exists or not
        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId)
            }
        })

        if(!user) {
            return res.status(404).send({ success: false, message: "User doesn't exists" });
        }

        // update user
        const deletedUser = await prisma.user.delete({
            where: {
                id: Number(userId)
            }
        })

        res.send({ success: true, user: deletedUser })
        
    } catch (error) {
        
        res.status(500).send({ success: false, message: "Internal Server Error" });
    }
}










