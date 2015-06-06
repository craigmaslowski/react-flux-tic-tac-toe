var CHANGE_EVENT = 'change';

var defaultGameData = { 
  gameBoard: [
    [null, null, null],
    [null, null, null], 
    [null, null, null]
  ],
  turn: 1,
  winner: null
};

var _gameData = JSON.parse(JSON.stringify(defaultGameData));

function resetGameData () {
  _gameData = JSON.parse(JSON.stringify(defaultGameData));
};

function canClaimSquare (x, y) {
  return !_gameData.winner && _gameData.gameBoard[y][x] === null;
}

function claimSquare (x, y, marker) {
  _gameData.gameBoard[y][x] = marker;
  _gameData.turn++;
};

function checkForWinner (cells) {
  return cells[0] !== null && cells[0] === cells[1] && cells[0] === cells[2];
}

function setWinner () {
  var gameBoard = _gameData.gameBoard;
  
  // check columns and rows for winner
  for (var i = 0; i <= 2; i++) {
    if (checkForWinner(gameBoard[i])) {
      return _gameData.winner = gameBoard[i][0];
    }
  
    if (checkForWinner([ gameBoard[0][i], gameBoard[1][i], gameBoard[2][i] ])) {
      return _gameData.winner = gameBoard[0][i];
    }
  }
  
  // check diagonals for winner
  if (
    checkForWinner([ gameBoard[0][0], gameBoard[1][1], gameBoard[2][2] ])
    || checkForWinner([ gameBoard[2][0], gameBoard[1][1], gameBoard[0][2] ])
  ) {
    return _gameData.winner = gameBoard[1][1];
  }
  
  return undefined;
}

var TicTacToeStore = assign({}, EventEmitter.prototype, {
  getGameData: function () {
    return _gameData;
  },
    
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },
  
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

TicTacToeStore.dispatcherId = AppDispatcher.register(function (action) {
  switch (action.actionType) {
    case TicTacToeConstants.TIC_TAC_TOE_TAKE_TURN:
      if (canClaimSquare(action.turnData.x, action.turnData.y)) {
        claimSquare(
          action.turnData.x, 
          action.turnData.y, 
          _gameData.turn % 2 === 0
            ? 'O'
            : 'X'
        );
        setWinner();
        TicTacToeStore.emitChange();
      }
      break;
      
    case TicTacToeConstants.TIC_TAC_TOE_START_NEW_GAME:
      resetGameData(); 
      TicTacToeStore.emitChange();
  }
});