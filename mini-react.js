class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type)
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }
  appendChild(component) {
    this.root.appendChild(component.root) // 1这边添加的是component.root
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content)
  }
}

export class Component {
  constructor() {
    this.props = Object.create(null)
    this.children = []
    this._root = null // 3所以需要创建一个私有属性来获取root
  }
  setAttribute(name, value) {
    this.props[name] = value
  }
  appendChild(component) {
    this.children.push(component) // 2这边添加的是component
  }
  get root () { // class创建getter
    if (!this._root) { // 单例模式 通过render函数渲染节点
      this._root = this.render().root
    }
    return this._root
  }
}

export function createElement(type, attributes, ...children) {
  let element;
  if (typeof type === 'string') {
    element = new ElementWrapper(type)
  } else {
    element = new type;
  }
  for (let attr in attributes) {
    element.setAttribute(attr, attributes[attr])
  }
  let insertChildren = (children) => {
    for (let child of children) {
      if (typeof child === 'string') {
        child = new TextWrapper(child)
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
  parentElement.appendChild(component.root)
}