/**
 * @desc 限制高频访问的api名单
 * 1. 时间窗口 10s
 * 2. 限制次数 3
 * @author justJokee
 */

exports.HEIGHLIMIT = 3
exports.HEIGHLIMITTL = 1000 * 10

exports.highLimitApis = ['/api/front/comments/save', '/api/front/messageBoard/save']
