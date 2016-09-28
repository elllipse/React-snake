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
        this.applePlace();
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
        let snake = this.state.snake;
        let snakeFirstElem = snake[0];
        let snakeLastElem = snake[snake.length-1];
        console.log(snakeLastElem);
        let squares = this.state.squares;
        let newFirstElem;
        let newSnake = snake;
        let containInRow, row, cell, appleId, newSquares, snakeLastElemEating;

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


        row = squares[+newFirstElem[0]-1];

        if (!row) {
            clearInterval(this.moveSnakeTimer);
            alert('game over!');
            return
        }
        row.map((el)=>{
            if (el.id == newFirstElem) {
                containInRow  = true;
            }
            if (el.isApple) {
                appleId = el.id;
            }
        });

        if (!containInRow) {
            clearInterval(this.moveSnakeTimer);
            alert('game over!');
            return

        }

        if (snake.indexOf(newFirstElem) > -1) {
            clearInterval(this.moveSnakeTimer);
            alert('game over!');
            return
        }

        if (newFirstElem == appleId) {
            squares[newFirstElem[0] - 1][newFirstElem[1] - 1].appleEated = true;
            this.applePlace();
        }

        newSnake.pop();
        newSnake.unshift(newFirstElem);

        snakeLastElemEating = squares[snakeLastElem[0]-1][snakeLastElem[1]-1];
        if (snakeLastElemEating.appleEated) {
            snakeLastElemEating.appleEated = false;
            newSnake.push('55') // CHANGE THIS TO CORRECT VALUE
        }

        this.setState({
            direction: direction,
            snake: newSnake,
            squares: squares
        })
    },
    applePlace: function() {
        var self = this;
        var row,cell, newSquares;
        function randomCoords() {
            let randomRow = Math.ceil(Math.random() * rows);
            let randomCell = Math.ceil(Math.random() * cells);



            let coords = '' + randomRow + randomCell;
            if (snake.indexOf(coords) > -1) {
                randomCoords();
            } else {
                row = +coords[0] - 1;
                cell = +coords[1] - 1;

                newSquares = self.state.squares;
                if (self.lastApplePos) {
                    newSquares[self.lastApplePos[0]-1][self.lastApplePos[1]-1].isApple = false;
                }
                newSquares[row][cell].isApple = true;
                self.lastApplePos = newSquares[row][cell].id;

                self.setState({
                    squares: newSquares
                })
            }
        }
        randomCoords();
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
        let isApple = this.props.square.isApple;
        let appleEated = this.props.square.appleEated;

        if (isApple) style.backgroundColor = 'green';

        if (snakeIndex > -1) {
            if (snakeIndex == 0) {
                style.backgroundColor = 'red';
            } else {
                style.backgroundColor = '#000';
            }

            if (appleEated) style.transform = 'scale(1.3)';
        }

        return (
            <div data-id={this.props.square.id} style={style} className='square'></div>
        )
    }
});


ReactDOM.render(<Field />, document.getElementById('app'));