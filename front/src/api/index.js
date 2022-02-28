import article from './article'
import visitor from './visitor'
import comments from './comments'
import messageBoard from './messageBoard'

export default {
  ...article,
  ...visitor,
  ...comments,
  ...messageBoard
}
