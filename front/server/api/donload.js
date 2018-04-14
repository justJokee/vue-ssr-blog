const express = require('express')
const router = express.Router()
const fs = require("fs")
const path = require("path")
const download_confirmToken = require("../middleware/download_confirmToken")
router.get('/api/downloadDb',download_confirmToken,(req,res) =>{
	res.download(path.join(__dirname,"../db/copyDownload/dbCopy.zip"),(err)=>{
		if(err){
			res.status(500).end()
		}else{
            res.status(200).end()
        }
	})

	//原生方法
    // let currDir = path.normalize(req.query.dir),
    //     fileName = req.query.name,
    //     currFile = path.join(currDir,fileName),
   	// 	fReadStream
    // fs.exists(currFile,function(exist) {
    //     if(exist){
    //         res.set({
    //             "Content-type": "application/octet-stream",
    //             "Content-Disposition": "attachmentfilename="+encodeURI(fileName)
    //         })
    //         fReadStream = fs.createReadStream(currFile)
    //         fReadStream.on("data",(chunk) => res.write(chunk,"binary"))
    //         fReadStream.on("end",function () {
    //             res.end()
    //         })
    //     }else{
    //         res.set("Content-type","text/html")
    //         res.send("file not exist!")
    //         res.end()
    //     }
    // }) 
})

module.exports = router