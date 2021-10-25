var _pieces;

function setRotation() {
    for(var i=0;i < _pieces.length;i++){
        setCurrentPiece(_pieces[i]);
        if(_pieces[i].degrees == "0"){
            continue;
        }
        switch(Number(_pieces[i].rotate)){
            case 1:
                rotate(270);
                _rotateStep++;
                document.getElementById("rotateCount").innerHTML = _rotateStep;
                break;
            case 2:
                rotate(180);
                _rotateStep++;
                document.getElementById("rotateCount").innerHTML = _rotateStep;
                break;
            case 3:
                rotate(90);
                _rotateStep++;
                document.getElementById("rotateCount").innerHTML = _rotateStep;
                break;
            default:
                break;
        }
    }
}

function setPieces() {
    _pieces = getSufflePieces();
    setRotation();
}
function updateRotateStep(){

}