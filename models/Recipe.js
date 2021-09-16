const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const recipeSchema = new Schema({
    title: {
        type:String,
        required:[true,"Debes agregar un nombre del platillo"]
    },
    thumbnail: {
        type:String,
        required:[true,"Debes agregar una foto del platillo"]
    },
    description: {
        type:String,
        required:[true,"Debes agregar una descripcion del platillo"],
        max:200
    },
    servingsAmount: {
        type:Number,
        required:[true,"Debes agregar cuantas porciones tiene el platillo"],
        min:1,
        max:50
    },
    ingredientsAmount: {
        type:Number,
        required:[true,"Debes agregar cuantos ingredientes tiene la receta"],
        min:1,
        max:50
    },
    caloriesPerServing: {
        type:Number,
        min:1,
        max:9999
    },
    tags: {
        type:[String],
        required:[true,"Debes agregar por lo menos una categoria a la receta."]
    },
    ingredients: {
        type:[String],
        required:[true,"Debes agregar por lo menos un ingrediente principal a la receta."]
    },
    favorites: {
        type:Number,
        default:0
    },
    step: {
        type:[{img:String,description:String}],
        validate: [arrayLimit, 'Se debe tener minimo 1 paso y maximo 15']
    },
    time: {
        type : Date,
        default: Date.now
    },
    _owner: {
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    _ownerEmail: {
        type:String,
        required:[true,"Debes agregar el email del creador de la receta"],
    },
    _comments: {
        type:[Schema.Types.ObjectId],
        ref:"Comment"
    },
},{timestapms:true})

function arrayLimit(val) {
    return (val.length > 0 && val.length <= 15);
}

module.exports = model("Recipe",recipeSchema);