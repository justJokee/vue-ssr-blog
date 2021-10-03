const express = require('express')
const router = express.Router()
const pro = require('child_process')
const archiver = require('archiver')
const fs = require('fs')
const path = require('path')
const confirmToken = require('../middleware/confirmToken')
const deleteF = require('../utils/deleteF')
router.get('/api/copyData', confirmToken, (req, res) => {
  //下次备份前删除旧的备份文件
  deleteF.file(path.join(__dirname, '../db/copyDownload'))
  deleteF.folder(path.join(__dirname, '../db/dbData/blog'))
  pro.exec(
    'F:/MongoDB/bin/mongodump -h 127.0.0.1:27017 -u username -p password -d blog -o ' +
      path.join(__dirname, '../db/dbData'),
    (err, stdout, stderr) => {
      if (err !== null) {
        res.status(500).end()
      } else {
        //压缩备份后的文件夹
        let archive = archiver('zip')
        let output = fs.createWriteStream(path.join(__dirname, '../db/copyDownload/dbCopy.zip'))
        archive.pipe(output)
        //第二个参数是压缩包内的层级目录
        archive.directory(path.join(__dirname, '../db/dbData/blog'), '/dbCopy')
        archive.finalize()
        res.json({ code: 200 })
      }
    }
  )
})

module.exports = router
