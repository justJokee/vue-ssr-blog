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
fs.copySync('./package.json', './dist/package.json')
fs.copySync('./server.js', './dist/server.js')
fs.copySync('./ecosystem.config.js', './dist/ecosystem.config.js')

console.log('部署资源复制完毕 >>>>')
console.log()
