/**
 * @desc   获取七牛云token
 * @author Justjokee
 */

import http from '@/http/'
export default {
  // 获取文章所有的tag
  getQiniuToken(payload) {
    return http.get('/api/front/qiniu/getToken', payload).then((data) => {
      return data
    })
  }
}
