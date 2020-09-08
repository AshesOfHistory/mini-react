import { createElement, render, Component } from './mini-react'
class MyComponent extends Component {
  render() {
    return <div>this is my component</div>
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