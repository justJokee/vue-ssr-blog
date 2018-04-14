const express = require('express')
const router = express.Router()
const db = require("../db/db")
const localTime = require("../utils/reviseTime")
const confirmToken = require("../middleware/confirmToken")
router.get("/api/getComments",(req,res) => {
	let num = parseInt(req.query.articleId)	
	db.comment.find({articleId: req.query.articleId},(err,doc) => {
		if(err){
			res.status(500).end()
		}else{
			res.json(doc)
		}
	}).sort({_id: -1})
})
//后台管理
router.get("/api/getAdminComments",confirmToken,(req,res) =>{
	let limit = 10
	let skip = req.query.page*limit - limit
	db.comment.find({},(err,doc) =>{
		if(err){
			res.status(500).end()
		}else{
			res.json(doc)
		}
	}).sort({"_id": -1}).skip(skip).limit(limit)
})
//后台管理删除一级评论
router.delete("/api/removeComments",confirmToken,(req,res)=>{
	db.comment.remove({_id: {$in: req.query.id}},(err)=>{
		if(err){
			res.status(500).end()
		}else{
			res.json({deleteCode: 200})
		}
	})
})
//后台管理删除二级评论
router.patch("/api/reduceComments",confirmToken,(req,res) =>{
	db.comment.update({"_id": req.body.mainId},{$pull: {"reply": {"_id": req.body.secondId}}},(err,doc) => {
		if(err){
			res.status(500).end()
		}else{
			res.json({deleteCode: 200})
		}
	})
})	
router.post("/api/saveComment",(req,res) => {
	new db.comment(req.body).save((err,doc) => {
		if(err){
			res.status(500).end()
		}else{
			res.json(doc)
			db.article.update({articleId: req.body.articleId},{$inc: {commentNum: 1}},(err,doc) => {
				if(err){
					res.status(500).end()
				}
			})
			new db.newMsg({
				type: "comment",
				name: req.body.name,
				say: req.body.content,
				content: req.body.name + "在" + localTime(Date.now()) + "评论了你的文章--" +  req.body.title
			}).save()
		}
	})	
})
//前后端文章评论回复（二级评论）
router.patch("/api/addComment",(req,res) => {
	let addInfo = {
		name: req.body.name,
		imgUrl: req.body.imgUrl,
		email: req.body.email,
		aite: req.body.aite,
		content: req.body.content,
		like: req.body.like,
		date: req.body.date
	}
	db.comment.findByIdAndUpdate({_id: req.body._id},{$push: {reply: addInfo}},{new: true},(err,doc) => {
		if(err){
			res.status(500).end()
		}else{
			res.json(doc)
		}
	})
})
router.patch("/api/addLike",(req,res) => {
	//是否为二级评论
	if(req.body.repId){
		db.comment.update({_id: req.body.revId,"reply._id": req.body.repId},{$inc: {"reply.$.like": req.body.addOrDel}},(err,doc) => {
			if(err){
				res.status(500).end()
			}else{
				res.json({code: 200})
			}
		})
	}else{
		db.comment.update({_id: req.body.revId},{$inc: {"like": req.body.addOrDel}},(err,doc) => {
			if(err){
				res.status(500).end()
			}else{
				res.json({code: 200})
			}
		})
	}	
})
module.exports = router