const Recipe = require('../models/Recipe');

//Crear receta
exports.createRecipe = (req, res, next) => {
    let request = req.body;
    request["_owner"]=req.user._id;
    request["_ownerEmail"]=req.user.email;
    console.log("REQUEST",request);

    Recipe.create(request)
    .then(recipe => {
        res.status(200).json({result:recipe})
    })
    .catch( error => res.status(400).json({error}))
}

//Editar receta
exports.editRecipe = (req, res, next) => {
    const {_id} = req.body;
    const {favorites, ...restRequest} = req.body;
    console.log("REQUEST",restRequest);

    Recipe.findOneAndUpdate({$and:[{_id},{_owner:req.user_id}]},restRequest,{new:true})
    .then(recipe => {
        res.status(200).json({result:recipe})
    })
    .catch( error => res.status(400).json({error}))
}

//Eliminar receta
exports.deleteRecipe = (req, res, next) => {
    const {_id} = req.body;

    Recipe.findOneAndDelete({_id})
    .then(() => {
        res.status(200).json({msg:'Receta eliminada'})
    })
    .catch( error => res.status(400).json({error}))
}

//Obtener receta en especifico
exports.findRecipe = (req, res, next) => {
    const {_id} = req.body;

    Recipe.findById(_id)
    .then((recipe) => {
        res.status(200).json({recipe})
    })
    .catch( error => res.status(400).json({error}))
}

//Buscar recetas
exports.findRecipes = (req, res, next) => {
    const {title, tags, ingredients, maxIngredients, orderBy="date", type="search"} = req.body;
    console.log("REQ USER",req.user)
    //Por default se ordena por _id (orden/fecha de creacion)
    let sortBy = {_id:-1};
    let queryArray = [];

    if(type==="myRecipes") queryArray.push({_owner:req.user._id});
    if(type==="myFavorites") queryArray.push({_id:{$in:req.user._favoritos}});
    if(title) queryArray.push({title:{$regex:`.*${title}.*`, $options:'i'}});
    if(tags.length>0) queryArray.push({tags: {$in:tags}});
    if(ingredients.length>0) queryArray.push({ingredients: {$in:ingredients}});
    if(maxIngredients) queryArray.push({ingredientsAmount:{$lte:maxIngredients}});
    if(orderBy==="favoritos") sortBy={favorites:-1}

    let request=null;
    if (queryArray.length>0) request = {$and:queryArray}
    console.log("REQUEST",queryArray);
    console.log("SORT",sortBy);

    //res.status(200).json({msg:"todo chido hasta aqui",sortBy,request});
    Recipe.find(request).sort(sortBy)
    .then(recipesArr => {
        recipesArr.forEach(recipe => {

            //If the user is searching by tag, then look for the recipes with most of the user selected tags
            if(tags.length>0){
                let countMatchingTags=0;
                tags.forEach(tag =>{
                    if(recipe.tags.find(recipeTag => recipeTag===tag)) countMatchingTags++;
                })
                recipe.matchedTags=countMatchingTags;
            }

            //If the user is searching by ingredient, then look for the recipes with most of the user selected ingredients
            if(ingredients.length>0){
                let countMatchingIngredients=0;
                ingredients.forEach(ingredient =>{
                    if(recipe.ingredients.find(recipeIngredient => recipeIngredient===ingredient)) countMatchingIngredients++;
                })
                recipe.matchedIngredients=countMatchingIngredients;
            }

            //If the user is prioritizing recipes by favorite ingredients, then look for the recipes with most of the user favorite ingredients
            if(orderBy==="ingredientesFavoritos") {
                let countMatchingFavorites=0;
                req.user.ingredientesFavoritos.forEach(favorite =>{
                    if(recipe.ingredients.find(recipeIngredient => recipeIngredient===favorite)) countMatchingFavorites++;
                })
                recipe.matchedFavorites=countMatchingFavorites;
            }
        });
        //Sort by matching favorites, ingredients and tags
        if(tags.length>0) recipesArr.sort((a, b) => (b.matchedTags) - (a.matchedTags));
        if(ingredients.length>0) recipesArr.sort((a, b) => (b.matchedIngredients) - (a.matchedIngredients));
        if(orderBy==="ingredientesFavoritos") recipesArr.sort((a, b) => (b.matchedFavorites) - (a.matchedFavorites));

        res.status(200).json({result:recipesArr})
    })
    .catch( error => res.status(400).json({error}))
}

//Edit Recipe
exports.editRecipe = (req, res, next) => {
    const{_id,...newData} = req.body;
    console.log("REQ BODYYYY",req.body);
    console.log("newData",newData);
    Recipe.findByIdAndUpdate(_id,newData,{new:true})
    .then(recipe => {
      res.status(200).json({result:recipe})
    })
    .catch( error => res.status(400).json({error}))
}