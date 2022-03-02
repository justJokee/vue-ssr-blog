import article from './article'
import visitor from './visitor'
import comments from './comments'
import messageBoard from './messageBoard'
import category from './category'

export default {
  ...article,
  ...visitor,
  ...comments,
  ...messageBoard,
  ...category
}
