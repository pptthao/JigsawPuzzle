var _puzzle;
// main canvas
var _stage;
// alt canvas
var _canvastemp;
// puzzle parameters
var _row_segments;
var _col_segments;
var _puzzleWidth;
var _puzzleHeight;
var _pieceWidth;
var _pieceHeight;
var _ratio;

var _img;
var _pieces;
var _currentPiece;
var _currentDropPiece;
var _mouse;
var _step;

function initGame(src,x_segments,y_segments){
    _rotateStep =0;
    _pieces = [];
    _img = new Image();
    _img.addEventListener('load',initPuzzle,false);
    _img.src = src;
    _puzzle = document.getElementById('puzzle');
    _stage = _puzzle.getContext('2d');
    _stage.clearRect(0,0,_puzzle.width,_puzzle.height);
    _col_segments = x_segments;
    _row_segments = y_segments;
    _ratio = _img.naturalHeight /_img.naturalWidth;
    _puzzleWidth = $('#puzzlebox').width();
    _puzzleHeight = Math.floor(_puzzleWidth * _ratio);
    _pieceWidth = _puzzleWidth / _col_segments;
    _pieceHeight = _puzzleHeight / _row_segments;
}
function initPuzzle(){
    _step = 0;
    document.getElementById("stepCount").innerHTML = _step;
    _canvastemp = document.createElement('canvas')
    _pieces = [];
    _mouse = {x:0,y:0};
    _puzzle.width = _puzzleWidth;
    _puzzle.height = _puzzleHeight;
    _canvastemp.width = _puzzleWidth;
    _canvastemp.height = _puzzleHeight;
    buildPieces(true);
}
function buildPieces(shuffleRotate = false){
    var piece;
    var xPos = 0;
    var yPos = 0;
    for(let i = 0 ; i < _row_segments * _col_segments ; i++){
        piece = {
            sx:xPos,
            sy:yPos,
            degrees:0,
            position: i+1,
            rotate: 0
        };
        _pieces.push(piece);
        xPos += _pieceWidth;
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
    _pieces = shuffleArray(_pieces);
    rotateCanvas(shuffleRotate);
    showPieces();
}

function showPieces(){
    var piece;
    _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    for(i = 0; i < _pieces.length ; i++){
        piece = _pieces[i];
        _stage.drawImage(_canvastemp, Math.floor(piece.sx), Math.floor(piece.sy), _pieceWidth, _pieceHeight, Math.floor(piece.xPos), Math.floor(piece.yPos), _pieceWidth, _pieceHeight);
        //draw border
        _stage.strokeRect(Math.floor(piece.xPos), Math.floor(piece.yPos) , _pieceWidth, _pieceHeight);
    }
    _puzzle.onmousedown = onPuzzleClick;
}

function shuffleArray(array){
    for(let i = array.length-1 ; i > 0 ; i--){
        var j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

function rotateCanvas(shuffleRotate = false) {
    var piece;
    var piececanvas;
    var xPos = 0;
    var yPos = 0;
    _canvastemp.getContext('2d').clearRect(0,0,_puzzleWidth,_puzzleHeight);
    for(let i = 0; i < _pieces.length; i++){
        piece = _pieces[i];
        piece.xPos = xPos;
        piece.yPos = yPos;
        if(shuffleRotate){
            degrees = Math.floor(Math.random() * 4) * 90;
            if(i>0) piece.degrees = degrees;
            switch(degrees){
                case 0:
                    _pieces[i].rotate = 0;
                    break;
                case 90:
                    _pieces[i].rotate = 1;
                    break;
                case 180:
                    _pieces[i].rotate = 2;
                    break;
                case 270:
                    _pieces[i].rotate = 3;
                    break;
                default:
                    _pieces[i].rotate = 0;
                    break;
            }
        }
        piececanvas = createPiece(piece);
        _canvastemp.getContext('2d').save();
        _canvastemp.getContext('2d').drawImage(piececanvas, 0, 0, _pieceWidth, _pieceHeight, Math.floor(piece.sx), Math.floor(piece.sy), _pieceWidth, _pieceHeight);
        _canvastemp.getContext('2d').restore();
        xPos += _pieceWidth;
        if(xPos >= _puzzleWidth){
            xPos = 0;
            yPos += _pieceHeight;
        }
    }
}

function createPiece(piece) {
    let pieceimage = canvasimg = document.createElement('canvas');
    canvasimg.width = _puzzleWidth;
    canvasimg.height = _puzzleHeight;
    canvasimg.getContext('2d').save();
    canvasimg.getContext('2d').drawImage(_img,0,0,_puzzleWidth,_puzzleHeight);
    canvasimg.getContext('2d').restore();
    // draw border
    let imagedata = canvasimg.getContext('2d').getImageData(Math.floor(piece.sx), Math.floor(piece.sy),_pieceWidth, _pieceHeight);
    pieceimage.width = _pieceWidth;
    pieceimage.height = _pieceHeight;
    pieceimage.getContext('2d').putImageData(imagedata, 0, 0);
    pieceimage.getContext('2d').save();
    pieceimage.getContext('2d').translate(Math.floor(_pieceWidth/2),Math.floor(_pieceHeight/2));
    pieceimage.getContext('2d').rotate(piece.degrees * Math.PI / 180);
    pieceimage.getContext('2d').drawImage(pieceimage,-Math.floor(_pieceWidth/2),-Math.floor(_pieceHeight/2));
    pieceimage.getContext('2d').restore();
    return pieceimage;
}

function onPuzzleClick(e){
    if(e.layerX || e.layerX == 0){
        _mouse.x = e.layerX - _puzzle.offsetLeft;
        _mouse.y = e.layerY - _puzzle.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0){
        _mouse.x = e.offsetX - _puzzle.offsetLeft;
        _mouse.y = e.offsetY - _puzzle.offsetTop;
    }
    // get clicked piece
    _currentPiece = checkPieceClicked();
    if(_currentPiece != null){
        _stage.clearRect(Math.floor(_currentPiece.xPos), Math.floor(_currentPiece.yPos), _pieceWidth, _pieceHeight);
        _stage.save();
        // make current piece transparent
        _stage.globalAlpha = .9;
        _stage.drawImage(_canvastemp, Math.floor(_currentPiece.sx), Math.floor(_currentPiece.sy), _pieceWidth, _pieceHeight, _mouse.x - Math.floor(_pieceWidth / 2), _mouse.y - Math.floor(_pieceHeight / 2), _pieceWidth, _pieceHeight);
        _stage.restore();
        _puzzle.onmousemove = updatePuzzle;
        _puzzle.onmouseup = pieceDropped;
    }
}

function checkPieceClicked(){
    for(let i = 0 ; i < _pieces.length ; i++){
        if(_mouse.x < Math.floor(_pieces[i].xPos) || _mouse.x > (_pieces[i].xPos + _pieceWidth) || _mouse.y < Math.floor(_pieces[i].yPos) || _mouse.y > (_pieces[i].yPos + _pieceHeight)){
            //PIECE NOT HIT
        }
        else{
            _pieces[i].current = true;
            return _pieces[i];
        }
    }
    return null;
}

function updatePuzzle(e){
    _currentDropPiece = null;
    if(e.layerX || e.layerX == 0){
        _mouse.x = e.layerX - _puzzle.offsetLeft;
        _mouse.y = e.layerY - _puzzle.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0){
        _mouse.x = e.offsetX - _puzzle.offsetLeft;
        _mouse.y = e.offsetY - _puzzle.offsetTop;
    }
    _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    var piece;
    for(let i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        if(piece == _currentPiece){
            continue;
        }
        _stage.drawImage(_canvastemp, Math.floor(piece.sx), Math.floor(piece.sy), _pieceWidth, _pieceHeight, Math.floor(piece.xPos), Math.floor(piece.yPos), _pieceWidth, _pieceHeight);
        // draw border for all other piece except current holding
        _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth,_pieceHeight);
        if(_currentDropPiece == null){
            if(_mouse.x < Math.floor(piece.xPos) || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < Math.floor(piece.yPos) || _mouse.y > (piece.yPos + _pieceHeight)){
                //NOT OVER #d63031 #009900
            }
            else{
                if(_mouse.x > Math.floor(_currentPiece.xPos+_pieceWidth*2) || _mouse.x < Math.floor(_currentPiece.xPos-_pieceWidth) // di ngang qua 1 o
                    || _mouse.y > Math.floor(_currentPiece.yPos+_pieceHeight*2) || _mouse.y < Math.floor(_currentPiece.yPos-_pieceHeight) // di doc qua 2 o
                    || (_mouse.y > Math.floor(_currentPiece.yPos+_pieceHeight) || _mouse.y < Math.floor(_currentPiece.yPos) ) && (_mouse.x > Math.floor(_currentPiece.xPos+_pieceWidth) || _mouse.x < Math.floor(_currentPiece.xPos))) // di cheo
                    {
                    _stage.save();
                    _stage.globalAlpha = .4;
                    _stage.fillStyle = '#d63031';
                    _stage.fillRect(Math.floor(piece.xPos),Math.floor(piece.yPos),_pieceWidth, _pieceHeight);
                    _stage.restore();
                }
                else{
                    _currentDropPiece = piece;
                    _stage.save();
                    _stage.globalAlpha = .4;
                    _stage.fillStyle = '#009900';
                    _stage.fillRect(Math.floor(_currentDropPiece.xPos),Math.floor(_currentDropPiece.yPos),_pieceWidth, _pieceHeight);
                    _stage.restore();
                }
            }
        }
    }
    // draw holding image
    _stage.save();
    _stage.globalAlpha = .6;
    _stage.drawImage(_canvastemp, Math.floor(_currentPiece.sx), Math.floor(_currentPiece.sy), _pieceWidth, _pieceHeight, _mouse.x - Math.floor(_pieceWidth / 2), _mouse.y - Math.floor(_pieceHeight / 2), _pieceWidth, _pieceHeight);
    _stage.restore();
    // draw border for current piece
    _stage.strokeRect( _mouse.x - Math.floor(_pieceWidth / 2), _mouse.y - Math.floor(_pieceHeight / 2), _pieceWidth,_pieceHeight);
}

function pieceDropped(e){
    _puzzle.onmousemove = null;
    _puzzle.onmouseup = null;
    if(_currentDropPiece != null){
        // switch current piece with holding piece
        var tmp = {xPos:Math.floor(_currentPiece.xPos),yPos:Math.floor(_currentPiece.yPos)};
        _stage.clearRect(Math.floor(_currentPiece.sx), Math.floor(_currentPiece.sy),_pieceWidth, _pieceHeight);
        _currentPiece.xPos = Math.floor(_currentDropPiece.xPos);
        _currentPiece.yPos = Math.floor(_currentDropPiece.yPos);
        _currentDropPiece.xPos = tmp.xPos;
        _currentDropPiece.yPos = tmp.yPos;
        
        _step++;
        $('#stepCount').text(_step);
        // reset the dropping piece
        _currentDropPiece = null;
    }
    resetPuzzleAndCheckWin();
}

function resetPuzzleAndCheckWin(){
    _stage.clearRect(0,0,_puzzleWidth,_puzzleHeight);
    var gameWin = true;
    var piece;
    for(let i = 0;i < _pieces.length;i++){
        piece = _pieces[i];
        _stage.clearRect(Math.floor(piece.xPos), Math.floor(piece.yPos), _pieceWidth,_pieceHeight);
        _stage.drawImage(_canvastemp, Math.floor(piece.sx), Math.floor(piece.sy), _pieceWidth, _pieceHeight, Math.floor(piece.xPos), Math.floor(piece.yPos), _pieceWidth, _pieceHeight);
        // draw border
        _stage.strokeRect(Math.floor(piece.xPos), Math.floor(piece.yPos), _pieceWidth,_pieceHeight);
        if(Math.floor(piece.xPos) != Math.floor(piece.sx) || Math.floor(piece.yPos) != Math.floor(piece.sy) || piece.degrees != 0){
            gameWin = false;
        }
    }
    if(gameWin){
        endGame();
    }
}

function gameOver(){
    _puzzle.onmousedown = null;
    _puzzle.onmousemove = null;
    _puzzle.onmouseup = null;
}

function rotate(degrees) {
    // for auto rotate on init
    if(_currentPiece.degrees = 0) return;
    else if (_currentPiece.degrees != 0) degrees = Number(degrees);

    let pieceimage = piececanvas = document.createElement('canvas');
    // get image piece data
    let imagedata = _canvastemp.getContext('2d').getImageData(Math.floor(_currentPiece.sx), Math.floor(_currentPiece.sy),_pieceWidth, _pieceHeight);
    // set rotation piece parameter
    pieceimage.width = _pieceWidth;
    pieceimage.height = _pieceHeight;
    pieceimage.getContext('2d').putImageData(imagedata, 0, 0);
    // create rotated canvas
    pieceimage.getContext('2d').save()
    pieceimage.getContext('2d').translate(Math.floor(_pieceWidth/2),Math.floor(_pieceHeight/2));
    pieceimage.getContext('2d').rotate(degrees * Math.PI / 180);
    pieceimage.getContext('2d').drawImage(pieceimage,-Math.floor(_pieceWidth/2),-Math.floor(_pieceHeight/2));
    pieceimage.getContext('2d').restore();
    // draw rotated canvas
    _canvastemp.getContext('2d').save()
    _canvastemp.getContext('2d').drawImage(pieceimage, 0, 0, _pieceWidth, _pieceHeight, Math.floor(_currentPiece.sx), Math.floor(_currentPiece.sy), _pieceWidth, _pieceHeight);
    _canvastemp.getContext('2d').restore();
    return resetPuzzleAndCheckWin();
}

function endGame(){
    _stage.clearRect(0,0,_puzzle.width,_puzzle.height);
    _canvastemp.getContext('2d').clearRect(0,0,_puzzle.width,_puzzle.height);
    _canvastemp.getContext('2d').drawImage(_img,0,0,_puzzle.width,_puzzle.height);
    _stage.drawImage(_canvastemp, 0, 0, _puzzle.width, _puzzle.height, 0, 0, _puzzle.width, _puzzle.height);
    setTimeout(gameOver,500);
}
function getSufflePieces() {
    return _pieces;
}
function setCurrentPiece(piece) {
    _currentPiece = piece;
}