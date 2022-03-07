/**
 * @desc 定时任务 - 爬取豆瓣电影
 */

const schedule = require('node-schedule')
const DoubanSpider = require('douban-spider-v')
const fs = require('fs-extra')
const path = require('path')
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
  uid: 'tan-mu'
})

function startSchedule() {
  // 每天凌晨1点进行爬取
  schedule.scheduleJob('0 0 1 * * *', async () => {
    // schedule.scheduleJob('0 50 18 * * *', async () => {
    console.log('定时任务触发------>>>>>>>')
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
    console.log('第1页爬取成功====>>>>>')
    if (res.page.totalPage > 1) {
      // 保存总页码数
      fs.writeFileSync(`${moviesPath[method]}/pageTotal.txt`, res.page.totalPage + '', 'utf8')

      for (let i = 2; i <= res.page.totalPage; i++) {
        // for (let i = 2; i <= 3; i++) {
        // 爬取速度1分钟1页，避免触发反爬
        await sleep()
        const res = await douban[method](i)
        cache[method].push(res.data)
        console.log(`第${i}页爬取成功====>>>>>`)
      }
    }
    // 写入json文件
    cache[method].forEach((doc, index) => {
      fs.ensureDirSync(moviesPath[method])
      fs.writeFileSync(`${moviesPath[method]}/${index + 1}.json`, JSON.stringify(doc), 'utf8')
    })
  } catch (e) {
    console.log('爬虫解析错误---->>>>', e)
    cache = {
      getMovieCollect: [],
      getMovieWish: [],
      getMovieDo: []
    }
  }
}
async function sleep(ms = 1000 * 30) {
  await new Promise(resolve => setTimeout(resolve, ms))
}
exports.startSchedule = startSchedule
