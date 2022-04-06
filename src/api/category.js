/**
 * @desc   分类
 * @author Justjokee
 */
import http from '@/http/'
export default {
  // 获取分类
  getCategory(payload) {
    return http.get('/api/front/category/get', payload).then((data) => {
      return data
    })
  }
}
