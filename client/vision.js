
var video;
var ctx;
var width;
var height;
var clientRect;
var imageNr = 0;


function imageOnload() {
    ctx.drawImage(this, 0, 0, 320, 240 );
}

function CreateImageLayer() {
    var img = new Image();
    img.style.position = "absolute";
    img.style.zIndex = 0;
    img.onload = imageOnload;
   // img.src = "http://localhost:3000/";
    img.src = 'data:image/jpeg;base64,' + btoa('');
    ctx.drawImage(img, 0, 0, 320, 240 );
}
function InitVisionModule() {
    video=document.getElementById("videocanvas");
    ctx=video.getContext("2d");
    colourNameSelector =  document.getElementById( "colourNameSelector" );

    width=video.width;
    height=video.height;
    clientRect = video.getBoundingClientRect();


    
    CreateImageLayer();
}


function test(){
   var xhr = new XMLHttpRequest();
   xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
         alert(xhr.responseText);
         console.log(tf.tensor(xhr.responseText));
         console.log(JSON.parse(xhr.responseText));
      }
   }
   xhr.open('GET', 'http://localhost:3000/prediction', true);
   xhr.send();
}
