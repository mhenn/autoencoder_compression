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

   const process.cwd()
   const encoder_model = await tf.loadLayersModel('http://localhost:8000/encoder_model/model.json');
   return encoder_model
}

async function getModel(){
   const cwd = process.cwd()
   const model = await tf.loadLayersModel('http://localhost:8000/full_model/model.json')
   return model
}


function prepareData(){
   let t = []

   for (i=0; i < set.training.length; i++){
      t.push(set.training[i].input)
   } 

   return tf.tensor(t).reshape([20,28,28]) 
}



app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*") 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
});


app.get('/prediction', function (req, res) {

   var set = mnist.set(20,10);

   getModel().then(mod => {
      getPartialModel().then(p_mod=>{
      p_mod = setPartialModel(p_mod,mod, 1,1)
      res.send(predict(mod,t))
      res.end()
      });
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

