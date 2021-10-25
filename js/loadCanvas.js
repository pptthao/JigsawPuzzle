function loadImg(){
    //init mesurements
    var img = new Image();
    var canvas = document.getElementById("puzzle");
    var ctx = canvas.getContext("2d");
    var puzzlebox =  document.getElementById("puzzlebox");
    
    //scaling image to 2nd canvas
    img.src = document.getElementById("file-image").src;
    _ratio = img.naturalHeight / img.naturalWidth;
    
    var boxpadding = window.getComputedStyle(puzzlebox,null).getPropertyValue("padding");
    var width = puzzlebox.clientWidth - parseInt(boxpadding)*2;
    var height = Math.floor(width * _ratio);
    var canvasImg = document.createElement('canvas');
    //draw target canvas
    canvasImg.width = width;
    canvasImg.height = height;
    canvasImg.getContext('2d').drawImage(img,0,0,width,height);
    //resize origin canvas
    canvas.width = width;
    canvas.height = height;
    //draw scaled image to canvas
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(canvasImg, 0, 0, width, height, 0, 0, width, height);
    // ctx.strokeRect(0, 0, width+1,height+1);
};