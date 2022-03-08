/**
 * @desc   访客信息
 * @author Justjokee
 */

import http from '@/http/'
export default {
  // 存储访客信息
  saveVisitor(payload) {
    return http.post('/api/front/visitor/save', payload).then(data => {
      return data
    })
  },
  isExistedVisitor(payload) {
    return http.post('/api/front/visitor/existed', payload).then(data => {
      return data
    })
  }
}
