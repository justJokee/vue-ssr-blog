const express = require('express')
const path = require("path")
const router = express.Router()
const db = require("../db/db")
const multer = require("multer")
const async = require("async")
router.get("/api/getTime",(req,res) => {
	db.article.find({publish: req.query.publish},{date: 1},(err,doc) => {
		if(err){
			res.status(500).end()
		}else{
			let timeArr = []
			doc.forEach((item,index,arr) => {
				let yearMonth = new Date(item.date).getFullYear() + "年" + (new Date(item.date).getMonth()+1) +"月"
				if(timeArr.indexOf(yearMonth) === -1){
					timeArr.push(yearMonth)
				}
			})
			async.map(timeArr,(item,callback) =>{
				//通前端请求时一样处理
				let year = item.match(/\d+/g)[0],
					month = parseInt(item.match(/\d+/g)[1]),
					endDay,
					start,
					end
				if(month === 2){
					endDay = 28
				}else if(month === 1||month == 3||month === 5||month === 7||month === 8||month === 10||month === 12){
					endDay = 31
				}else{
					endDay = 30
				}
				for (let i = 0;i < 9;i++){
					if(month === i){
						month = "0" + month
					}
				} 
				start = new Date(year + "-" + month + "-" + "01")
				end = new Date(year + "-" + month + "-" + endDay)
				db.article.count({publish: true,date: {"$gte": start,"$lte": end}},(err,num) => {
					if(err){
						console.log(err)
					}else{
						callback(null,{time: item,num: num})
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

let storage = multer.diskStorage({
	destination: function(req,file,cd){
		cd(null,path.join(__dirname,"../upload"))
	},
	filename: function(req,file,cd){
		cd(null,file.originalname)
	}
})
let upload = multer({
	storage: storage
})
router.post("/api/up",upload.array("img-key",10),(req,res) =>{
	console.log("==========")
	console.log(req.files)
	// console.log("==========================")
	// console.log(req.files.name_file.originalFilename)
	// console.log("==========================")
	// console.log(req.files.name_file.path)
	res.end()
})


module.exports = router