import http from '@/http/'

export default {
  // 获取友链列表
  getFriendLinkList() {
    return http.get('/api/front/friendLink/list').then((data) => {
      return data
    })
  },
  // 申请友链
  applyFriendLink(data) {
    return http.post('/api/front/friendLink/apply', data).then((data) => {
      return data
    })
  }
}
