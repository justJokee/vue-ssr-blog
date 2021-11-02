import http from '@/http/'
export default {
  // 获取文章列表
  getArticles(payload) {
    return http.get('/api/front/article/gets', payload).then(data => {
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
