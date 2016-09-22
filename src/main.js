var React = require('react');
var ReactDOM = require('react-dom');

require('./css/main.css');

var rows = 8;
var cells = 8;
var allSquares = [];

var snake = ['33','34','35']

for (var r = 0; r < rows; r++) {
    let row = [];
    for (var c = 0; c < cells; c++) {
        row.push({
            id: ''+r+c,
            isActive: false,
        })
    }
    allSquares.push(row);
}

var Field = React.createClass({
    getInitialState: function(){
      return {
          squares: allSquares,
          snake: snake
      }
    },
    render: function() {
        return (
            <div className='field'>
                {this.state.squares.map((row, i)=>{
                    return <Row snake={this.state.snake} row={row} key={i}/>
                })}
            </div>
        )
    }
});

var Row = React.createClass({
    render: function() {
        return (
            <div className='row'>
                {this.props.row.map((square, i)=>{
                    return <Square snake={this.props.snake} square={square} key={i}/>
                })}
            </div>
        )
    }
});

var Square = React.createClass({
    render: function() {
        let style = {};
        let snakeIndex = this.props.snake.indexOf(this.props.square.id);

        if (snakeIndex > -1) {
            if (snakeIndex == 0) {
                style.backgroundColor = 'red';
            } else {
                style.backgroundColor = '#000';
            }
        }

        return (
            <div data-id={this.props.square.id} style={style} className='square'></div>
        )
    }
});


ReactDOM.render(<Field />, document.getElementById('app'));