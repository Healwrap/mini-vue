let number = 1
/**
 * 虚拟DOM节点
 */
export default class VNode {
  constructor(tag, // 标签类型，DIV、SPAN、INPUT、#TEXT
              nodeType, // 节点类型
              elem, // 对应的真实DOM
              parent, // 父节点
              children, // 子节点
              text, // 虚拟节点的文本
              data, // 虚拟节点的数据
  ) {
    this.tag = tag
    this.nodeType = nodeType
    this.elem = elem
    this.parent = parent
    this.children = children
    this.text = text
    this.data = data
    this.env = {} // 当前节点的环境变量
    this.instructions = null // 存放指令
    this.template = [] // 当前节点涉及的模板
    this.number = number++
  }
}
