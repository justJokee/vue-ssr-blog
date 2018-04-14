const express = require('express')
const router = express.Router()
const db = require("../db/db")
router.get("/api/getTime",(req,res) => {
	db.article.find({publish: req.query.publish},{date: 1},(err,doc) => {
		if(err){
			res.status(500).end()
		}else{
			let timeArr = []
			doc.forEach((item,index,arr) => {
				let yearMonth = new Date(item.date).getFullYear()+ "年" + (new Date(item.date).getMonth()+1) +"月"
				if(timeArr.indexOf(yearMonth) === -1){
					timeArr.push(yearMonth)
				}
			})
			res.json(timeArr)
		}
	})
})

module.exports = router