/**
 * @desc 创建数据库/第三方登录等配置文件
 * @author justJokee
 */

const fs = require('fs')
const path = './server/db/secret.js'

if (!fs.existsSync(path)) {
  const str = fs.readFileSync('./template/secret.js')
  fs.writeFileSync(path, str, 'utf8')

  console.log()
  console.log('配置文件创建成功 >>>>')
  console.log()
}
