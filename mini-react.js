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
  for (const attr in attributes) {
    element.setAttribute(attr, attributes[attr])
  }
  for (const child of children) {
    if (typeof child === 'string') {
      child = new TextWrapper(child)
    }
    element.appendChild(child)
  }
  return element
}

export function render(component, parentElement) {
  parentElement.appendChild(component.root)
}