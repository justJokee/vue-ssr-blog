/**
 * @desc 密钥管理模板
 * @author justJokee
 */

// 数据库配置
exports.db = {
  user: 'admin',
  pwd: '12345',
  db: 'blog'
}
// 用户密码，签证盐值
exports.userSecret = {
  account: 'test',
  pwd: '12345',
  salt: '12345',
  avatar: 'https://avatars.githubusercontent.com/u/35912907?v=4'
}
// github三方服务配置
exports.githubSecret = {
  clientId: '',
  secret: ''
}
// 七牛云配置
exports.qiniuConfig = {
  AccessKey: '',
  SecretKey: '',
  Bucket: '',
  Port: 9000,
  // demo 启动后会在本地 /uptoken 上提供获取 uptoken 的接口，所以这里可以填 'token'
  UptokenUrl: '<Your Uptoken_Url>',
  // Bucket 的外链默认域名，在 Bucket 的内容管理里查看
  Domain: ''
}
// 豆瓣uid
exports.doubanConfig = {
  uid: '173712770'
}
