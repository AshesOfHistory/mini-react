const RANDER_TO_DOM = Symbol("range to dom")

export class Component {
  constructor() {
    this.props = Object.create(null)
    this.children = []
    this._root = null // 3所以需要创建一个私有属性来获取root
    this._range = null // 初始化range存放对象
  }
  get vdom() { // Component的内容由render决定
    return this.render().vdom // 递归调用 若render还是Component，依旧会调用Component的vdom，直到render的是一个ElementWrapper
  }
  setAttribute(name, value) {
    this.props[name] = value
  }
  appendChild(component) {
    this.children.push(component) // 2这边添加的是component
  }
  [RANDER_TO_DOM](range) { // state 状态更新之后需要重新渲染
    this._range = range
    this.render()[RANDER_TO_DOM](range)
  }
  rerender() { // 重新绘制函数
    let oldRange = this._range // 缓存range 因为[RANDER_TO_DOM]方法会重置this._range
    let range = document.createRange()
    range.setStart(oldRange.startContainer, oldRange.startOffset)
    range.setEnd(oldRange.startContainer, oldRange.startOffset) // 将新range的起点放在老range的起点上
    this[RANDER_TO_DOM](range) // 将新range插入到dom中
    oldRange.setStart(range.endContainer, range.endOffset) // 重置老range的起点为新range的终点
    oldRange.deleteContents() // 将原本老range的内容删除,这样就只剩新的range内容了
  }
  setState(newState) {
    if (this.state === null || typeof this.state !== 'object') { // 历史遗留问题  typeof null 为object
      this.state = newState
      this.rerender()
      return
    }
    let merge = (oldState, newState) => { // 深拷贝合并对象
      for (let key in newState) {
        if (oldState[key] === null || typeof oldState[key] !== 'object') {
          oldState[key] = newState[key]
        } else {
          merge(oldState[key], newState[key])
        }
      }
    }
    merge(this.state, newState)
    this.rerender()
  }
}
class ElementWrapper extends Component {
  constructor(type) {
    super(type)
    this.type = type
  }
  get vdom() { // 为了能够调用渲染方法，需要返回this
    return this
  }
  get vchildren() { // 为了避免与父组件的children混淆 新建一个vchildren获取虚拟children
    return this.children.map(child => child)
  }
  [RANDER_TO_DOM](range) { // 生成实体dom的逻辑全都在这里执行
    range.deleteContents()
    let root = document.createElement(this.type)
    for (let name in this.props) { // 为dom添加属性
      let value = this.props[name]
      if (name.match(/^on([\s\S]+)$/)) { // \s所有空白 \S所有非空白 结合在一起表示所有字符 ()匹配模式  RegExp.$1表示匹配到的值 支持on*写法,用来绑定事件
        root.addEventListener(RegExp.$1.replace(/^[\s\S]/, word => word.toLowerCase()), value) // 有时为驼峰式onClick，RegExp.$1 为Click，需要确保首字母小写，事件大小写敏感
      } else {
        if (name === 'className') {
          root.setAttribute('class', value)
        } else {
          root.setAttribute(name, value)
        }
      }
    }
    for (let child of this.children) { // 每个child实际上是个Component 
      let childRange = document.createRange()
      childRange.setStart(root, root.childNodes.length) // 这里起始节点必须为最后才对应添加节点
      childRange.setEnd(root, root.childNodes.length)
      child[RANDER_TO_DOM](childRange)
    }
    range.insertNode(root)
  }
}

class TextWrapper extends Component {
  constructor(content) {
    super(content)
    this.type = '#text'
    this.content = content
    this.root = document.createTextNode(content)
  }
  get vdom() { 
    return this
  }
  [RANDER_TO_DOM](range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}

export function createElement(type, attributes, ...children) {
  let element;
  if (typeof type === 'string') {
    element = new ElementWrapper(type)
  } else {
    element = new type
  }
  for (let attr in attributes) {
    element.setAttribute(attr, attributes[attr])
  }
  let insertChildren = (children) => {
    for (let child of children) {
      if (typeof child === 'string') {
        child = new TextWrapper(child)
      }
      if (child === null) {
        continue
      }
      if ((typeof child === 'object') && (child instanceof Array)) { // 判断child是否为数组 需要考虑到数组嵌套情况 所以需要递归展开
        insertChildren(child)
      } else { // insertChildren的时候无需append
        element.appendChild(child)
      }
    }
  }
  insertChildren(children)
  return element
}

export function render(component, parentElement) {
  let range = document.createRange()
  range.setStart(parentElement, 0)
  range.setEnd(parentElement, parentElement.childNodes.length)
  range.deleteContents()
  component[RANDER_TO_DOM](range)
}