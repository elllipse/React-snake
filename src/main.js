var React = require('react');
var ReactDOM = require('react-dom');

require('./css/main.css');

var rows = 34;
var cells = 34;
var allSquares = [];

var snake = ['11-13', '11-14', '11-15', '11-16', '11-17', '11-18'];

for (var r = 1; r <= rows; r++) {
    let row = [];
    for (var c = 1; c <= cells; c++) {
        row.push({
            id: `${r}-${c}`,
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
          interval: 80
      }
    },
    componentDidMount: function() {
        var field = document.querySelector('.field');
        field.style.width = cells * 10 + 'px';
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
        let snakeFirstElemRow = snakeFirstElem.split('-')[0];
        let snakeFirstElemCell = snakeFirstElem.split('-')[1];
        let snakeLastElem = snake[snake.length-1];
        let squares = this.state.squares;
        let newFirstElem;
        let newSnake = snake;
        let containInRow, row, cell, appleId, newSquares, snakeLastElemEating;


        switch (direction) {
            case 'left':
                newFirstElem = snakeFirstElemRow + '-' + (+snakeFirstElemCell - 1);
                break;

            case 'right':
                newFirstElem = snakeFirstElemRow + '-' + (+snakeFirstElemCell + 1);
                break;

            case 'top':
                snakeFirstElemRow = +snakeFirstElemRow - 1;
                newFirstElem = snakeFirstElemRow + '-' + snakeFirstElemCell;
                break;

            case 'bottom':
                snakeFirstElemRow = +snakeFirstElemRow + 1;
                newFirstElem = snakeFirstElemRow + '-' + snakeFirstElemCell;
                break;
        }


        row = squares[+snakeFirstElemRow-1];

        if (!row) {
            clearInterval(this.moveSnakeTimer);
            console.log('game over!');
            return
        }

        row.map((cell)=>{

            if (cell.id == newFirstElem) {
                containInRow  = true;
            }
            if (cell.isApple) {
                appleId = cell.id;
            }
        });

        if (!containInRow) {
            clearInterval(this.moveSnakeTimer);
            console.log('game over!');
            return

        }

        if (snake.indexOf(newFirstElem) > -1) {
            clearInterval(this.moveSnakeTimer);
            console.log('game over!');
            return
        }

        if (newFirstElem == appleId) {
            squares[+snakeFirstElemRow-1][+snakeFirstElemCell - 1].appleEated = true;
            this.applePlace();
        }

        newSnake.pop();
        newSnake.unshift(newFirstElem);

        if (this.addEatedElem) {
            newSnake.push(this.addEatedElem);
            this.addEatedElem = null;
        }

        snakeLastElemEating = squares[+snakeFirstElemRow-1][+snakeFirstElemCell-1];
        if (snakeLastElemEating.appleEated) {
            snakeLastElemEating.appleEated = false;
            this.addEatedElem = newSnake[newSnake.length-1];
            //newSnake.push((+newSnake[newSnake.length-1] + 1) + '') // CHANGE THIS TO CORRECT VALUE
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
            let randomRow = Math.floor(Math.random() * rows);
            let randomCell = Math.floor(Math.random() * cells);

            let coords = randomRow + '-' + randomCell;
            if (snake.indexOf(coords) > -1) {
                randomCoords();
            } else {
                row = randomRow;
                cell = randomCell;

                newSquares = self.state.squares;
                //console.log(` apple will render at row ${row} and cell ${cell}`);
                if (self.lastApplePos) {
                    let pos = self.lastApplePos.split('-');
                    let row = +pos[0] - 1;
                    let cell = +pos[1] - 1;
                    newSquares[row][cell].isApple = false;
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
/*    shouldComponentUpdate: function() {
        let snake = this.props.snake;
        let row =[];
        for (var el in this.props.row) {
            row.push(el.id);
        };
        let rowContainSnake = snake.some((el) => {
            return row.indexOf(el.id) > -1;
        });

        if (rowContainSnake) {
            return true;
        } else {
            return false;
        }
    },*/
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