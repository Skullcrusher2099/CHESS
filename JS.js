var board = null;
var game = new Chess();
var $status = $('#status');

function onDragStart (source, piece, position, orientation) {
  if (game.game_over()) return false;
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
}

function onDrop (source, target) {
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' 
  });

  if (move === null) return 'snapback';
  updateStatus();
}

function onSnapEnd () {
  board.position(game.fen());
}

function updateStatus () {
  var status = '';
  var moveColor = (game.turn() === 'b') ? 'Black' : 'White';

  if (game.in_checkmate()) {
    status = 'Checkmate! ' + moveColor + ' loses.';
  } else if (game.in_draw()) {
    status = 'Draw!';
  } else {
    status = moveColor + "'s Turn";
    if (game.in_check()) status += ' (Check!)';
  }

  $status.html(status);
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
};

board = Chessboard('myBoard', config);

$('#resetBtn').on('click', function() {
    game.reset();
    board.start();
    updateStatus();
});

$('#undoBtn').on('click', function() {
    game.undo();
    board.position(game.fen());
    updateStatus();
});

updateStatus();
