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
  // 获取文章详情
  getArticle(payload) {
    return http.get('/api/front/article/detail', payload).then(data => {
      return data
    })
  }
}
