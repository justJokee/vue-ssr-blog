const express = require('express')
const async = require("async")
const router = express.Router()
const db = require("../db/db")
const confirmToken = require("../middleware/confirmToken")
router.get("/api/tags",(req,res) => {
	let publish = req.query.publish === "false" ? false : true
	let tagArr = []
	db.article.find({publish: publish}).distinct("tag",(err,doc) => {
		if(err){
			res.status(500).end()
		}else{
			async.map(doc,(item,callback) =>{
				db.article.count({publish: true,tag: item},(err,num) => {
					if(err){
						console.log(err)
					}else{
						callback(null,{tag: item,num: num})
					}
				})
			},(err,results) =>{
				if(err){
					console.log(err)
				}else{
					res.json(results)
				}
			})
		}
	})
})
router.get("/api/adminTags",confirmToken,(req,res) => {
	let publish = req.query.publish === "false" ? false : true,
		tagArr = {articlesSum: 0,tags: []}
	db.article.find({publish: publish}).distinct("tag",(err,doc) => {
		if(err){
			res.status(500).end()
		}else{
			async.map(doc,(item,callback) =>{
				db.article.count({publish: true,tag: item},(err,num) => {
					if(err){
						console.log(err)
					}else{
						callback(null,{tag: item,num: num})
					}
				})
			},(err,results) =>{
				if(err){
					console.log(err)
				}else{
					tagArr.tags = results
					db.article.count({publish: true},(err,num) => {
						if(err){
							console.log(err)
						}else{
							tagArr.articlesSum = num
							res.json(tagArr)
						}
					})
				}
			})	
		}
	})
})

module.exports = router