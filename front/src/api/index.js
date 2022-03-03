import article from './article'
import visitor from './visitor'
import comments from './comments'
import messageBoard from './messageBoard'
import category from './category'
import tags from './tags'

export default {
  ...article,
  ...visitor,
  ...comments,
  ...messageBoard,
  ...category,
  ...tags
}
