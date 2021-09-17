const User = require('../models/User');
const bcrypt = require('bcrypt');
const {createToken,clearRes} = require('../config/Auth');

//Crear usuario
exports.signUp = (req, res, next) =>{
    const {email, username, password, confirmPassword, ...restUser} = req.body;

    //Verificar que los passwords sean iguales
    if(password != confirmPassword) {
        return res.status(400).json({msg:'Las contraseñas no coinciden.'});
    }

    //Verificar que el usuario no exista
    User.findOne({$or:[{email},{username}]})
    .then(user=>{
        //Si el usuario ya existe entonces mostrar error
        if(user) { return res.status(403).json({msg:'Este usuario ya existe.'}); }

        else {
            //Encriptar password
            bcrypt.hash(password,10)
            .then(hashedPass =>{
                const user = {
                    email,
                    password:hashedPass,
                    username,
                    ...restUser
                }

                //Crear usuario y guardar info en cookies
                User.create(user)
                .then(userCreated=>{
                    const newUser = clearRes(userCreated.toObject());
                    const token = createToken(userCreated);
                    res.cookie('token', token,{
                        expires: new Date(Date.now+86400000),
                        secure:false,
                        httpOnly:true
                    }).status(200).json({result:newUser});
                })
                .catch(error=>res.status(400).json({error}));
            })
            .catch(error=>res.status(400).json({error}));
        }
    })
    .catch(error=>res.status(400).json({error}));
}

//Logear usuario
exports.login = (req, res, next) => {
    const {name, password} = req.body;
    console.log('Name',name);

    //Verificar que el usuario si existe
    User.findOne({$or:[{email:name},{username:name}]})
    .then(user =>{
        if(user===null) {
            return res.status(403).json({msg:'El usuario no existe.'});
        }
        //Verificar password
        bcrypt.compare(password,user.password)
        .then(match=>{
            if(match) {
                const newUser = clearRes(user.toObject());
                const token = createToken(user);
                res.cookie('token', token,{
                    expires: new Date(Date.now+86400000),
                    secure:false,
                    httpOnly:true
                }).status(200).json({result:newUser});
            }
            else {
                return res.status(403).json({msg:'La contraseña es erronea.'});
            }
        })
    })
    .catch(error=>res.status(400).json({error}));
}

//Cambiar password
exports.changePassword = (req,res,next) =>{
    const {currentPassword, newPassword} = req.body;
    const {password, _id} = req.user;
     //Verificar password
     bcrypt.compare(currentPassword,password)
     .then(match=>{
         if(match) {
             //Generar nuevo password
             bcrypt.hash(newPassword,10)
             .then(hashedPass=>{
                User.findByIdAndUpdate(_id,{password:hashedPass},{new:true})
                .then(user => {
                  res.status(200).json({result:user})
                })
             })
             .catch(error=>res.status(400).json({error}));
         }
         else {
             return res.status(403).json({msg:'La contraseña es erronea.'});
         }
     })
     .catch(error=>res.status(400).json({error}));
}

//Obtener data del usuario logeado
exports.loggedUser = (req, res, next) => {
    const {user} = req;
    console.log(user);
    res.status(200).json({user});
}

//Verificar si el usuario no existe
exports.verifyUser = (req, res, next) => {
    const {username, email} = req.body;

    User.findOne({email})
    .then(user =>{
        if(user===null) {
            User.findOne({username})
            .then(user=>{
                if(user===null) return res.status(200).json({msg:'El usuario no existe.'});
                else return res.status(403).json({msg:'Ya existe una cuenta con este nombre de usuario.'});
            })
        }
        else {
            return res.status(403).json({error:'Ya existe una cuenta con este email'});
        }
    })
    .catch(error=>res.status(400).json({error}));
}

//Deslogear usuario
exports.logout = (req, res) =>{
    res.clearCookie('token').json({msg:'Logged off'});
}