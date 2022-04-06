/**
 * @desc 获取当前浏览类型
 */

module.exports = function getBrowser(userAgent) {
  //判断是否Opera浏览器
  const isOpera = userAgent.indexOf('Opera') > -1
  // 判断是否IE浏览器
  const isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera
  // 判断是否IE的Edge浏览器
  const isEdge = userAgent.indexOf('Windows NT 6.1; Trident/7.0;') > -1 && !isIE
  // 判断是否Firefox浏览器
  const isFF = userAgent.indexOf('Firefox') > -1
  // 判断是否Safari浏览器
  const isSafari = userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') == -1
  // 判断Chrome浏览器
  const isChrome = userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1

  if (isChrome) return 'Chrome'
  if (isFF) return 'FireFox'
  if (isSafari) return 'Safari'
  if (isOpera) return 'Opera'
  if (isEdge) return 'Edge'
  if (isIE) {
    const reIE = new RegExp('MSIE (\\d+\\.\\d+);')
    reIE.test(userAgent)
    const fIEVersion = parseFloat(RegExp['$1'])
    if (fIEVersion) return 'IE' + fIEVersion
    return 'IE'
  }
  return '未知'
}
