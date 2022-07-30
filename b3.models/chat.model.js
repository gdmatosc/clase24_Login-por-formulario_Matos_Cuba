const mongoose=require('mongoose');
const chatCollection='chatBasic'

const chatSchema=new mongoose.Schema({
    nombre:{type:String, require:true,max:100},
    correo:{type:String, require:true,max:100},
    edad:{type:Number, require:true,max:100},
    textIngresado:{type:String, require:true,max:100}
})

const chatModel=mongoose.model(chatCollection,chatSchema)
module.exports=chatModel;