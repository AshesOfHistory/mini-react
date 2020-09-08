import { createElement, render, Component } from './mini-react'
class MyComponent extends Component {
  constructor() {
    super()
    this.state = {
      username: 'jerry',
      age: 22,
      password: 'testpassword'
    }
  }
  render() {
    return <div>
      <h1>this is my component</h1>
      <p>{this.state.username.toString()}</p>
      <button onclick={ () => { this.state.age++; this.rerender() } }>add</button>
      <p>{this.state.age.toString()}</p>
    </div>
  }
}



render(
<MyComponent id = 'wrapper' class='wrapper'>
  <div class='children'>
    11outer
    <div>1111inner</div>
  </div>
  <div class='children'>2222</div>
  <div class='children'>3333</div>
</MyComponent>, document.body)