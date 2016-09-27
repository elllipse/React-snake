var React = require('react');
var ReactDOM = require('react-dom');

require('./css/main.css');

var rows = 8;
var cells = 8;
var allSquares = [];

var snake = ['44','45','46', '47', '48', '58', '68']

for (var r = 1; r <= rows; r++) {
    let row = [];
    for (var c = 1; c <= cells; c++) {
        row.push({
            id: ''+r+c,
        })
    }
    allSquares.push(row);
}

console.log(allSquares);

var Field = React.createClass({
    getInitialState: function(){
      return {
          squares: allSquares,
          snake: snake,
          direction: 'left',
          interval: 500
      }
    },
    componentWillMount: function(){
        document.addEventListener('keydown', (ev)=>{
            let currKey;
            let LastDir = this.state.direction;
            switch (ev.keyCode) {
                case 37:
                    currKey = 'left';
                    break;
                case 39:
                    currKey = 'right';
                    break;
                case 38:
                    currKey = 'top';
                    break;
                case 40:
                    currKey = 'bottom';
                    break;
            }
            if (LastDir == currKey) return;
            if (LastDir == 'left' && currKey == 'right') return;
            if (LastDir == 'right' && currKey == 'left') return;
            if (LastDir == 'top' && currKey == 'bottom') return;
            if (LastDir == 'bottom' && currKey == 'top') return;

            clearInterval(this.moveSnakeTimer);

            this.moveSnake(currKey);

            this.moveSnakeTimer = setInterval(()=>{
                this.moveSnake(currKey);
            }, this.state.interval);

        })
    },

    moveSnake: function(direction) {
        console.log('move to ' + direction);
        let snakeFirstElem = this.state.snake[0];
        let newFirstElem;
        let newSnake = this.state.snake;
        let contain, row;

        switch (direction) {
            case 'left':
                newFirstElem = snakeFirstElem - 1 + '';
                break;

            case 'right':
                newFirstElem = +snakeFirstElem + 1 + '';
                break;

            case 'top':
                newFirstElem = +snakeFirstElem - 10 + '';
                break;

            case 'bottom':
                newFirstElem = +snakeFirstElem + 10 + '';
                break;
        }


        row = this.state.squares[+newFirstElem[0]-1]
        if (!row) {
            clearInterval(this.moveSnakeTimer);
            alert('game over!');
            return
        }
        row.map((el)=>{
            if (el.id == newFirstElem) {
                contain  = true;
            }
            if (el.isFeed == true ) {
                console.log('+1 elem to snake');
            }
        });

        if (!contain) {
            clearInterval(this.moveSnakeTimer);
            alert('game over!');
            return

        };

        if (snake.indexOf(newFirstElem) > -1) {
            clearInterval(this.moveSnakeTimer);
            alert('game over!');
            return
        }

        newSnake.pop();
        newSnake.unshift(newFirstElem);

        this.setState({
            direction: direction,
            snake: newSnake
        })
    },
    render: function() {
        return (
            <div className='field' >
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