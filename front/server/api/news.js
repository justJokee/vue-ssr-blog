const express = require('express')
const router = express.Router()
const async = require("async")
const db = require("../db/db")
const confirmToken = require("../middleware/confirmToken")
router.get("/api/getNews",confirmToken,(req,res) => {
	async.map(["comment","msgboard","like"],(item,callback) =>{
		db.newMsg.find({type: item},(err,doc) =>{
			if(err){
				res.status(500).end()
			}else{
				callback(null,doc)
			}
		}).sort({_id: -1})
	},(err,result) =>{
		if(err){
			console.log(err)
		}else{
			db.newMsg.find({type: "pv"},(err,doc) =>{
				if(err){
					res.status(500).end()
				}else{
					db.newMsg.count({type: "pv"},(err,num) =>{
						let finArr = doc.concat(result[0],result[1],result[2])
						let finDoc = {pvNum: num,newsArr: finArr}
						res.json(finDoc)
					})
				}
			}).sort({_id: -1}).limit(15)
		}
	})
})
router.delete("/api/deleteNews",confirmToken,(req,res) =>{
	db.newMsg.remove({type: req.query.type},(err) =>{
		if(err){
			res.status(500).end()
		}else{
			res.json({deleteCode: 200})
		}
	})
})

module.exports = router