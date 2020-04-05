const tf = require('@tensorflow/tfjs')
const request = require('request')
const express =require('express')
const fs = require('fs')
const path = require('path')
const mnist = require('mnist')
const app = express()



function predict(model,data){
  const preds = model.predict(data);
  return preds;
}


function setPartialModel(part, model, layer, model_layer){
   part.layers[layer].setWeights(model.layers[model_layer].getWeights());
   return part
}


async function getPartialModel(){

   const encoder_model = await tf.loadLayersModel('http://localhost:8000/encoder_model/model.json');
   return encoder_model
}

async function getModel(){
   const model = await tf.loadLayersModel('http://localhost:8000/full_model/model.json')
   return model
}


function prepareData(){
   let t = []
   
   var set = mnist.set(20,10);
   for (i=0; i < set.training.length; i++){
      t.push(set.training[i].input)
   } 

   return tf.tensor(t).reshape([20,28,28]) 
}

function toObject(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    if (arr[i] !== undefined) rv[i] = arr[i];
  return rv;
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*") 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
});


app.get('/prediction', function (req, res) {


   getModel().then(mod => {
      getPartialModel().then(p_mod=>{
         p_mod = setPartialModel(p_mod,mod, 1,1)
         p_mod.predict(prepareData()).data().then(e =>{
            res.send(e)
            res.end()
         })
      })
   })

   //request('http://10.42.0.130:8080/?action=snapshot',{encoding:'binary'},  (err,resp,body)=>{
   // fs.writeFile('blah.jpg', body, 'binary', (err)=>{console.log(err)})
   //  res.send(body)
   // res.end() 
   // });
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

