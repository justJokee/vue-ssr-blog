/**
 * @desc   获取文章标签
 * @author Justjokee
 */

import http from '@/http/'
export default {
  // 获取文章所有的tag
  getTags(payload) {
    return http.get('/api/front/tags/count', payload).then(data => {
      return data
    })
  }
}
