/**
 * @desc  将打平的用层级关系维护的树状数据，组装成树结构
 * @param {*} flatList Object[]
 * @param {*} options  { level: Number} level，维护层级关系的字段
 * @used  目前用于自动生成文章的目录结构
 * @returns Array
 * @author justJokee
 */
export function generateTree(flatList, options = { level: 'level' }) {
  const result = []
  let stack = []

  flatList.forEach((item, index) => {
    // 栈为空，则直接入栈
    if (!stack.length) {
      stack.push(item)
      result.push(item)
    } else {
      // 获取栈顶元素
      let top = stack[stack.length - 1]
      if (item[options.level] > top[options.level]) {
        top.children = []
        top.children.push(item)
        stack.push(item)
      } else {
        // 同级别
        if (item[options.level] === top[options.level]) {
          stack.pop()
          stack[stack.length - 1].children.push(item)
          stack.push(item)
        } else {
          // 当前元素级别大于栈底元素，则倒序遍历栈，找到其父级并挂载
          if (item[options.level] > stack[0][options.level]) {
            stack.reverse().some(el => {
              if (el[options.level] < item[options.level]) {
                el.children.push(item)
                return true
              }
            })
            stack.reverse()
            stack.push(item)
          } else {
            // 清空栈
            stack = []
            stack.push(item)
            result.push(item)
          }
        }
      }
    }
  })
  return result
}
