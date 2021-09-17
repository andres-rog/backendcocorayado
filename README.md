Running the server
If you wish to run the server, the first step is installing yarn.

Once that's out of the way, open a terminal and run the following command:
yarn install
which will install all the dependencies

Now we need to add the credentials as .env variables
DB= database url
SECRET= secret keyword for password encryption
CLOUDNAME= the cloudinary folder
CLOUDAPIKEY= the cloudinary api key
CLOUDSECRET= the cloudinary password
PORT=3092

The server is now ready to run. Simply run
yarn start
the localhost port should be 3092, Jerome is my favorite spartan c:

Config folder:
createToken: gets the user and saves it as a cookie.
verifyToken: gets the saved token and reads it values.
checkRole: gets the saved token and verifies the user role to validate it on sensitive routes.
clearRes: cleans the token data so the user finishes the sesion.

Controllers folder:
   AuthController:
      signUp: obtains an object with strings as email:"", username:"", password:"", confirmPassword:"", ingredientesFavoritos:[""] as an optional value and creates and logs a user with those options.
      login: obtains an object with strings as email:"" or username:"" and password:"" so the user is logged in.
      changePassword: obtains an object with string as password:"", newPassword:"", confirmNewPassword:"" so the user password is updated.
      loggedUser: returns the data of the logged user.
      verifyUser: obtains an object with strings as username:"", email:"" and validates if a user exists with that username/email.
      logout: uses the clearRes and cleans the token data so the user finishes the sesion.
   CloudinaryController:
      upload: obtains an array of png/jpg/jpeg files and uploads them to the cloudinary server
   RecipeController:
      findRecipes: obtains an object with strings as title:"", tags:"", ingredients:"", maxIngredients:"", orderBy="", type="" to find a set of recipes with those criterias.
      findRecipe: obtains an object with strings as _id:"" to find an specific recipe.
      deleteRecipe: obtains an object with strings as _id:"" to delete a recipe
      editRecipe obtains an object with strings as _id:"", title:"", description:"", tags:[""], ingredients:[""], ingredientsAmount:"", servingsAmount:"", caloriesPerServing:"", thumbnail:"", steps:[{description:"", img:""}] to edit a recipe.
      createRecipe: obtains an object with strings as title:"", description:"", tags:[""], ingredients:[""], ingredientsAmount:"", servingsAmount:"", caloriesPerServing:"", thumbnail:"", steps:[{description:"", img:""}] to create a recipe.
   UserController:
      addRecipeToFavorites: obtains an _id from a recipe and add it as favorite
      removeRecipeFromFavorites: obtains an _id from a recipe and removes it from favorite
      listFavorites: obtains a list with all the recipes tagged as favorited by the user
      listRecipes: obtains a list with all the recipes made by the user
      editUser: obtains an object with strings as username:"", ingredientesFavoritos:[""] to change the user data.