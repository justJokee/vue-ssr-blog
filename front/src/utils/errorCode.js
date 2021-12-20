/**
 * @desc   错误码
 * @author justJokee
 */
import { Message } from 'element-ui'
export function errorCode(code) {
  switch (code) {
    case 200:
      break
    case 100:
      _message('warning', '昵称已存在')
      break
    case 101:
      _message('warning', '您已经点过赞了 ~')
      break
  }
}

function _message(t, m) {
  Message({
    type: t,
    message: m,
    center: true
  })
}
