/**
 * @desc 复制需要部署的文件、目录等
 * @author justJokee
 */

const fs = require('fs-extra')
console.log()
console.log('开始复制部署资源 >>>>')
console.log()
fs.copySync('./static', './dist/front')
fs.copySync('./src/index.template.html', './dist/front/index.template.html')
fs.copySync('./server', './dist/server')
fs.copySync('./server.js', './dist/server.js')
fs.copySync('./ecosystem.config.js', './dist/ecosystem.config.js')
// 处理package.json
const json = fs.readFileSync('./package.json')
const obj = JSON.parse(json)
;(obj.scripts['start:local'] = '../node_modules/.bin/cross-env NODE_ENV=production node server'),
  delete obj.scripts.preinstall
delete obj.scripts.prepare
fs.writeFileSync('./dist/package.json', JSON.stringify(obj, null, '\t'), 'utf8')

console.log('部署资源复制完毕 >>>>')
console.log()
