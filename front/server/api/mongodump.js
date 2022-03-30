/**
 * @desc 数据库备份
 * @author justJokee
 */
const express = require('express')
const router = express.Router()
const exec = require('child_process').exec
const archiver = require('archiver')
const fs = require('fs-extra')
const path = require('path')
const confirmToken = require('../middleware/confirmToken')
const { db } = require('../db/secret')
const moment = require('moment')
// 备份文件临时存放路径
const outputPath = path.join(__dirname, '../db/copy/temp')
let toolPath = '/usr/local/mongo-tools/bin/mongodump'
// 生产环境 mongodump 路径
if (process.env.NODE_ENV === 'production') {
  toolPath = '/usr/local/mongo-tools/bin/mongodump'
}
router.post('/api/admin/mongodump', confirmToken, async (req, res) => {
  // 清空临时存放路径
  fs.emptyDirSync(outputPath)
  const filename = moment().format('YYYY-MM-DD-HH-mm')
  const zipPath = path.join(__dirname, `../db/copy/mongodump-${filename}.zip`)
  exec(`${toolPath} -h 127.0.0.1:27017 -u ${db.user} -p ${db.pwd} -d ${db.db} -o ${outputPath}`, (err) => {
    if (err) {
      res.status(500).end()
    } else {
      const archive = archiver('zip')
      const output = fs.createWriteStream(zipPath)
      output.on('close', () => {
        const row = fs.readFileSync(zipPath)
        res.send(row)
      })
      archive.pipe(output)
      // 第二个参数是压缩包内的层级目录
      archive.directory(path.join(__dirname, '../db/copy/temp/mapblog'), '/mapblog')
      archive.finalize()
    }
  })
})

module.exports = router
