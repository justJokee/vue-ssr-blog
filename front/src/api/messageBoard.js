/**
 * @desc   留言板
 * @author Justjokee
 */
import http from '@/http/'
export default {
  // 获取留言列表
  getMessageBoard(payload) {
    return http.get('/api/front/messageBoard/gets', payload).then(data => {
      return data
    })
  },
  // 存储留言
  saveMessageBoard(payload) {
    return http.post('/api/front/messageBoard/save', payload).then(data => {
      return data
    })
  }
}
