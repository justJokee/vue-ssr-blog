/**
 * @desc 定时任务 - 爬取豆瓣电影等
 * @author justJokee
 */

const schedule = require('node-schedule')
const DoubanSpider = require('douban-spider-v')
const fs = require('fs-extra')
const path = require('path')
// 确保文件目录存在
fs.ensureDirSync(path.join(__dirname, '../files/movies/collect'))
fs.ensureDirSync(path.join(__dirname, '../files/movies/wish'))
fs.ensureDirSync(path.join(__dirname, '../files/movies/do'))

const moviesPath = {
  getMovieCollect: path.join(__dirname, '../files/movies/collect'),
  getMovieWish: path.join(__dirname, '../files/movies/wish'),
  getMovieDo: path.join(__dirname, '../files/movies/do')
}

let cache = {
  getMovieCollect: [],
  getMovieWish: [],
  getMovieDo: []
}
const douban = new DoubanSpider({
  uid: '173712770'
})

function startSchedule() {
  // 每天凌晨1点进行爬取
  schedule.scheduleJob('0 0 1 * * *', async () => {
    console.log('定时任务触发 -->>>>>')
    getMovies()
  })
}
async function getMovies() {
  await handleMovies('getMovieCollect')
  await sleep()
  await handleMovies('getMovieWish')
  await sleep()
  await handleMovies('getMovieDo')
}

async function handleMovies(method) {
  try {
    const res = await douban[method]()
    cache[method].push(res.data)
    console.log(`[${method}]: 第1页爬取成功 -->>>>`)
    fs.writeFileSync(`${moviesPath[method]}/pageTotal.txt`, res.page.totalPage + '', 'utf8')
    if (res.page.totalPage > 1) {
      // 保存总页码数

      for (let i = 2; i <= res.page.totalPage; i++) {
        // 爬取速度 30s/1页，避免触发反爬机制
        await sleep()
        const res = await douban[method](i)
        cache[method].push(res.data)
        console.log(`[${method}]: 第${i}页爬取成功 -->>>>`)
      }
    }
    // 写入json文件
    cache[method].forEach((doc, index) => {
      fs.ensureDirSync(moviesPath[method])
      fs.writeFileSync(`${moviesPath[method]}/${index + 1}.json`, JSON.stringify(doc), 'utf8')
    })
    // 释放空间
    cache[method] = []
  } catch (e) {
    console.log('爬虫解析错误 -->>>>', e)
    cache = {
      getMovieCollect: [],
      getMovieWish: [],
      getMovieDo: []
    }
  }
}
async function sleep(ms = 1000 * 30) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}
exports.startSchedule = startSchedule
