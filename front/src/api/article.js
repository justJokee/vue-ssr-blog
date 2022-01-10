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
  },
  // 获取文章评论
  getArticleComments(payload) {
    return http.get('/api/front/comments/get', payload).then(data => {
      return data
    })
  },
  // 获取上一篇文章和下一篇文章
  getPrevnextArticle(payload) {
    return http.get('/api/front/article/prevnext', payload).then(data => {
      return data
    })
  }
}
