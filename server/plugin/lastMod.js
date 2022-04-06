/**
 * @desc 为每一条存储/更新的数据添加最后修改时间
 * @param {*} schema
 * @param {*} options
 */
const moment = require('moment')
module.exports = function lastModifiePlugin(schema, options) {
  schema.add({ lastMod: 'date' })
  schema.pre('save', function(next) {
    this.lastMod = moment().format()
  })
  schema.pre('update', function(next) {
    this.lastMod = moment().format()
  })
}
