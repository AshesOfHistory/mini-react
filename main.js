import { createElement, render, Component } from './mini-react'
// class MyComponent extends Component {
//   constructor() {
//     super()
//     this.state = {
//       username: 'jerry',
//       age: 22,
//       password: 'testpassword'
//     }
//   }
//   render() {
//     return <div>
//       <h1>this is my component</h1>
//       <p>{this.state.username.toString()}</p>
//       <button onclick={ () => { this.setState({age: ++this.state.age}) } }>add</button>
//       <p>{this.state.age.toString()}</p>
//     </div>
//   }
// }



// render(
// <MyComponent id = 'wrapper' class='wrapper'>
//   <div class='children'>
//     11outer
//     <div>1111inner</div>
//   </div>
//   <div class='children'>2222</div>
//   <div class='children'>3333</div>
// </MyComponent>, document.body)


class Square extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button
        className="square"
        onClick={() => this.setState({value: 'X'})}
      >
        {this.state.value}
      </button>
    );
  }
}

class Board extends Component {
  renderSquare(i) {
    return <Square />;
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

render(
  <Game />,
  document.getElementById('root')
);
