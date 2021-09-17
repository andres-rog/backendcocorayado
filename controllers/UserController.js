const User = require('../models/User');
const Recipe = require('../models/Recipe');

//Editar usuario
exports.edit = (req, res, next) => {
    const {_id} = req.user;
    const{role,...restUser} = req.body;

    User.findByIdAndUpdate(_id,restUser,{new:true})
    .then(user => {
      res.status(200).json({result:user})
    })
    .catch( error => res.status(400).json({error}));
}

//Agregar receta a favoritos
exports.addRecipeToFavorites = (req, res, next) => {
    const {_id} = req.user;
    const{_recipeId} = req.body;
    User.findByIdAndUpdate(_id,{$push:{_favoritos:_recipeId}},{new:true})
    .then(user => {
        //Actualizar cantidad de favoritos en receta
        Recipe.findByIdAndUpdate({_id:_recipeId}, {$inc: { favorites: 1 }}, {new:true})
        .then(()=>{
            res.status(200).json({result:user})
        })
        .catch( error => res.status(400).json({error}));
    })
    .catch( error => res.status(400).json({error}));
}

//Remover receta de favoritos
exports.removeRecipeFromFavorites = (req, res, next) => {
    const {_id} = req.user;
    const{_recipeId} = req.body;

    User.findByIdAndUpdate(_id,{$pull:{_favoritos:_recipeId}},{new:true})
    .then(user => {
      Recipe.findByIdAndUpdate({_id:_recipeId}, {$inc: { favorites: -1 }}, {new:true})
      .then(()=>{
        res.status(200).json({result:user})
      })
      .catch( error => res.status(400).json({error}));
    })
    .catch( error => res.status(400).json({error}));
}

//Obtain favorites recipes list
exports.listFavorites = (req, res, next) => {
    const {_favoritos} = req.user;

    Recipe.findByIdAndUpdate({_id:{$in:_favoritos}})
    .then(favorites => {
      res.status(200).json({result:favorites})
    })
    .catch( error => res.status(400).json({error}));
}

//Obtain list of recipes made by user
exports.listRecipes = (req, res, next) => {
    const {_id} = req.user;

    Recipe.find({_ownerId:_id})
    .then(recipes => {
      res.status(200).json({result:recipes})
    })
    .catch( error => res.status(400).json({error}));
}

//Edit user
exports.editUser = (req, res, next) => {
  const{_id} = req.user;
  const{ingredientesFavoritos, username, email} = req.body;
  const newData = {ingredientesFavoritos, username, email}
  console.log("newData",newData);
  User.findByIdAndUpdate(_id,newData,{new:true})
  .then(user => {
    res.status(200).json({result:user})
  })
  .catch( error => res.status(400).json({error}))
}