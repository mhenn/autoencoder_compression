
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


function objToArray(obj){
   var arr = [];

   for (let [key,value] of Object.entries(obj)) {
      arr.push(value)
   }
   return arr
}


async function showPrediction( pred, size, name){
  const surface = tfvis.visor().surface({ name: 'Input Data Examples', tab: name});  
  
  for (let i = 0; i < size; i++){ 
    
    const imageTensor = tf.tidy(() => {
      // Reshape the image to 28x28 px
      return pred
        .slice([i, 0], [1, 28])
        .reshape([28, 28]);
    });
   
    const canvas = document.createElement('canvas');
    canvas.width = 28;
    canvas.height = 28;
    canvas.style = 'margin: 4px;';
    await tf.browser.toPixels(imageTensor, canvas);
    surface.drawArea.appendChild(canvas);

    imageTensor.dispose();

  }
}


function setPartialModel(part, model, layer, model_layer){
   part.layers[layer].setWeights(model.layers[model_layer].getWeights());
   return part
}

async function runPrediction(data){ 
  console.log(data)
  const model = await tf.loadLayersModel('http://localhost:8000/full_model/model.json');
  let decoder_model = await tf.loadLayersModel('http://localhost:8000/decoder_model/model.json');
  console.log()
  decoder_model = setPartialModel(decoder_model, model, 1,2);
  
  const pred_decode = decoder_model.predict(data);
 
  showPrediction(pred_decode, pred_decode.shape[0], "Combined Prediction");
}


function test(){
   var xhr = new XMLHttpRequest();
   xhr.onreadystatechange = function() {
      if (xhr.readyState == XMLHttpRequest.DONE) {
         tensor = tf.tensor(objToArray(JSON.parse(xhr.responseText)))
         runPrediction(tensor.reshape([20,32]))
      }
   }
   xhr.open('GET', 'http://localhost:3000/prediction', true);
   xhr.send();
}
