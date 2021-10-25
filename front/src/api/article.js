import http from '@/http/'
export default {
  //获取文章
  getArticles(payload) {
    return http.get('/api/front/article/gets', payload).then(data => {
      return data
    })
  }
}
