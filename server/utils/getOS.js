/**
 * @desc 获取当前操作系统
 * @returns
 */

module.exports = function getOS(userAgent) {
  if (userAgent.indexOf('Window') > 0) {
    return 'Windows'
  } else if (userAgent.indexOf('Mac OS X') > 0) {
    return 'MacOS'
  } else if (userAgent.indexOf('Linux') > 0) {
    return 'Linux'
  } else {
    return '未知'
  }
}
