const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const commentSchema = new Schema({
    comment:{
        type:String,
        required:[true,"El comentario no puede estar vacio"],
        max:200
    },
    _recipe:{
        type:Schema.Types.ObjectId,
        ref:"Recipe"
    },
    time: {
        type : Date,
        default: Date.now
    },
    _owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
},{timestapms:true})

module.exports = model("Comment",commentSchema);