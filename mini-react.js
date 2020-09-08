const RANDER_TO_DOM = Symbol("range to dom")
class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type)
  }
  setAttribute(name, value) {
    if (name.match(/^on([\s\S]+)$/)) { // \s所有空白 \S所有非空白 结合在一起表示所有字符 ()匹配模式  RegExp.$1表示匹配到的值 支持on*写法,用来绑定事件
      this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, word => word.toLowerCase()), value) // 有时为驼峰式onClick，RegExp.$1 为Click，需要确保首字母小写，事件大小写敏感
    } else {
      if (name === 'className') {
        this.root.setAttribute('class', value)
      } else {
        this.root.setAttribute(name, value)
      }
    }
  }
  appendChild(component) {
    let range = document.createRange()
    range.setStart(this.root, this.root.childNodes.length) // 这里起始节点必须为最后才对应添加节点
    range.setEnd(this.root, this.root.childNodes.length)
    component[RANDER_TO_DOM](range)
  }
  [RANDER_TO_DOM](range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content)
  }
  [RANDER_TO_DOM](range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}

export class Component {
  constructor() {
    this.props = Object.create(null)
    this.children = []
    this._root = null // 3所以需要创建一个私有属性来获取root
    this._range = null // 初始化range存放对象
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