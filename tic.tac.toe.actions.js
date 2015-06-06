var TicTacToeActions = {
  takeTurn: function (turnData) {
    AppDispatcher.dispatch({
      actionType: TicTacToeConstants.TIC_TAC_TOE_TAKE_TURN,
      turnData: turnData
    });
  },
  
  startNewGame: function (turnData) {
    AppDispatcher.dispatch({
      actionType: TicTacToeConstants.TIC_TAC_TOE_START_NEW_GAME
    });
  },  
};