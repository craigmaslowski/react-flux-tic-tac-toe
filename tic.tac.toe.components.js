/* global TodoActions */
/* global React */

var rce = React.createElement;
  
var TicTacToe = React.createClass({
  startNewGame: function (e) {
    e.preventDefault();
    TicTacToeActions.startNewGame();
  },
  
  getInitialState: function() {
    return TicTacToeStore.getGameData();
  },

  componentDidMount: function() {
    TicTacToeStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    TicTacToeStore.removeChangeListener(this._onChange);
  },
  
  render: function () {
    var status;
console.log(JSON.stringify(this.state));    
    if (this.state.turn === 10 && !this.state.winner) {
      status = 'It\s a tie!';
    } else {
      status = this.state.winner
        ? (((this.state.turn - 1) % 2 === 0) ? 'O' : 'X') + ' is the winner!'
        : 'It\'s ' + (this.state.turn % 2 === 0 ? 'O\'s' : 'X\'s') + ' turn.';
    }
    
    return (
      rce('div', {className: 'tictactoe'},
        rce('h1', {}, 'Tic Tac Toe'),
        rce(Board, { 
          gameBoard: this.state.gameBoard, 
          turn: this.state.turn,
          winner: this.state.winner,
          onClick: this.handleClick 
        }),
        rce('div', { className: 'status' }, status),
        (this.state.winner || this.state.turn === 10)
          ? rce('a', { href: '#', onClick: this.startNewGame }, 'Start New Game')
          : undefined
      )
    );
  },
  
  _onChange: function() {
    this.setState(TicTacToeStore.getGameData());
  }
});

var Board = React.createClass({
  render: function () {
    return (
      rce('div', { className: 'board'},
        rce(BoardRow, { rowNum: 0, rowData: this.props.gameBoard[0] }),
        rce(BoardRow, { rowNum: 1, rowData: this.props.gameBoard[1] }),
        rce(BoardRow, { rowNum: 2, rowData: this.props.gameBoard[2] })
      )
    );
  }
});

var BoardRow = React.createClass({
  render: function () {
   
   return (
     rce('div', { className: 'row' },
       rce(BoardCell, { x: 0, y: this.props.rowNum, value: this.props.rowData[0] }),
       rce(BoardCell, { x: 1, y: this.props.rowNum, value: this.props.rowData[1] }),
       rce(BoardCell, { x: 2, y: this.props.rowNum, value: this.props.rowData[2] })
     )
   );
  }
});

var BoardCell = React.createClass({
  handleClick: function () {
    TicTacToeActions.takeTurn({ 
      x: this.props.x, 
      y: this.props.y
    });
  },
  
  render: function () {
    var className = 'cell ' + 'x'+ this.props.x + ' y' + this.props.y;
    return rce('div', { className: className, onClick: this.handleClick }, this.props.value || '\u0020');
  }
});