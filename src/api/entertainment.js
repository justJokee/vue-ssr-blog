/**
 * @desc   娱乐
 * @author Justjokee
 */
import http from '@/http/'
export default {
  // 获取电影、电视剧等影视记录
  getMovies(payload) {
    return http.get('/api/front/douban/get', payload).then((data) => {
      return data
    })
  }
}
