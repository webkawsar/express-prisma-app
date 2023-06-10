module.exports.register = async (req, res) => {

    console.log(req.body, 'body')
    res.send({ success: true, message: "Registration successful" })
}









