const {Schema, model} = require('mongoose')
const passportLocal = require('passport-local-mongoose')

const userSchema = new Schema({
    username:{
        type:String,
        unique:[true,"El nombre de usuario ya existe"],
        required:[true,"Debes agregar un nombre de usuario"]
    },
    email:{
        type:String,
        unique:[true,"El email ya existe"],
        required:[true,"Debes agregar un correo"]
    },
    password:{
        type:String,
        required:[true,"Debes agregar una contraseña"]
    },
    ingredientesFavoritos:{
        type:[String]
    },
    _favoritos:{
        type:[String]
    },
    _recetas:[{
        type:Schema.Types.ObjectId,
        ref:"Recipe"
    }],
    role:{
        type:String,
        default:'USER',
        enum:['ADMIN','USER']
    }
},{timestapms:true})

userSchema.plugin(passportLocal, {usernameField: 'email'})
module.exports = model('User', userSchema)