const jwt = require("jsonwebtoken")
const secret = require("../secret")
const confirmToken = (req,res,next) => {
	if(!req.headers.authorization){
		res.json({code: 401})
	}else{
		const token = req.headers.authorization
		jwt.verify(token,secret.jwtSecret,(err) => {
			if(err){
				res.json({code: 401})
			}else{
				next()
			}
		})
	}
}
module.exports = confirmToken