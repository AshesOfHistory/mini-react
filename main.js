import { createElement, render, Component } from './mini-react'
class MyComponent extends Component {
  render() {
    return <div>
      <h1>this is my component</h1>
      {this.children}
    </div>
  }
}



render(
<MyComponent id = 'wrapper' class='wrapper'>
  <div class='children'>
    11
    <span>1111</span>
  </div>
  <div class='children'>2222</div>
  <div class='children'>3333</div>
</MyComponent>, document.body)