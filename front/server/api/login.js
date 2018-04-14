const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken")
const md5 = require("md5")
const confirmToken = require("../middleware/confirmToken")
const db = require("../db/db")
const secret = require("../secret")
const localTime = require("../utils/reviseTime")
const createToken = (id,name) => {
	return jwt.sign({
		id: id,
		user: name,
	},secret.jwtSecret,{expiresIn: "10h"})
}
router.post("/api/login",(req,res) => {
	db.user.find({user: req.body.user},(err,doc) => {
		if(err){
			res.status(500).end()
		}else if(doc.length){
			if(doc[0].password === md5(req.body.password + doc[0].salt)){
				let token = createToken(doc._id,doc[0].user),
					lastTime = doc[0].lastLogin,
					currTime = localTime(Date.now())
				db.user.update({user: "admin"},{lastLogin: currTime},(err,doc) =>{
					if(err){
						console.log(err)
					}
				})
				res.json({
					code: 200,
					id: doc[0]._id,
					name: doc[0].user,
					lastLogin: lastTime,
					token: token
				})
			}else{
				res.json({code: 401})
			}
		}else{
			res.json({code: 401})
		}
	})
})
//路由闯入编辑器页面进行token验证
router.get("/api/confirmToken",confirmToken,(req,res) =>{
	res.status(200).end()
})

module.exports = router