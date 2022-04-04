/**
 * @desc 创建数据库/第三方登录等配置文件
 * @author justJokee
 */

const fs = require('fs-extra')
const path = './server/db/secret.js'
if (!fs.pathExistsSync(path)) {
  const str = fs.readFileSync('./template/secret.js')
  fs.ensureFileSync(path)
  fs.writeFileSync(path, str, 'utf8')

  console.log()
  console.log('配置文件创建成功 >>>>')
  console.log()
}
