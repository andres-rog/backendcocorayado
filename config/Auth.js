const jwt = require('jsonwebtoken')
const User = require('../models/User')

//Create session token
exports.createToken = (user) => {
    const token = jwt.sign({id:user._id},process.env.SECRET,{
        expiresIn:'1d'
    })

    return token
}

//Verify user is logged
exports.verifyToken = (req, res, next) =>{
    const {token} = req.cookies
    jwt.verify(token, process.env.SECRET, (error, decoded)=>{
        //Va nuestro codigo si falla o esta correcto
        if(error){
            return res.status(401).json({msg:'Tienes que tener una sesion',error})
        }
        User.findById(decoded.id)
            .then(user => {
                req.user = user
                next()
            })
    });
}

//Verify user role
exports.checkRole = (roles) => {
    return(req,res,next) => {
        const {role} = req.user
        if(roles.includes(role)){
            return next()
        }
        else {
            return res.status(403).json({msg:'No tienes permiso para realizar esta accion'})
        }
    }
}

//Clear user data to log off
exports.clearRes = (data) => {
    const{password,__v,updateAt,...cleanedData} = data
    return cleanedData;
}