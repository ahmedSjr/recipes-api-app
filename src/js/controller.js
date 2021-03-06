// Core js
// import { search } from 'core-js/fn/symbol';
import 'core-js/stable';
//Run time
import { async } from 'regenerator-runtime/runtime';
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView';
import bookmarkView from './views/bookmarkView.js';
// import AddRecipeView from './views/addRecipeView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODEL_CLOSE_SEC } from './config.js';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//Request the recipes form the api

const controllerRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //Mark selected search results
    resultView.update(model.getSearchResultPage());

    //Update the bookmark view
    bookmarkView.update(model.state.bookmarks);

    //Loading recipe
    await model.loadRecipe(id);

    //Rendering the recipe
    recipeView.render(model.state.recipe);

    // controlServings();
  } catch (err) {
    recipeView.renderError();
    console.log(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    //For getting the query ot term
    const query = searchView.getQuery();
    if (!query) return;

    //Load  the result data from the api
    await model.loadSearchResult(query);

    //Render the results

    resultView.render(model.getSearchResultPage());

    //Render the pagination
    paginationView.render(model.state.search);
    //Clear the input fields
    // searchView.clearInput();
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  //Render new results
  resultView.render(model.getSearchResultPage(goToPage));

  //Render the pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe serving in state
  model.updateServings(newServings);
  //update the recipe view
  //   recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmarks = function () {
  //Add || remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);
  //Update the view
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarkView.render(model.state.bookmarks);
};

controlBookmarks = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  // console.log(newRecipe);
  try {
    //Spinner
    addRecipeView.renderSpinner();
    //Upload the recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    //Render the recipe
    recipeView.render(model.state.recipe);

    //Success message
    addRecipeView.renderMessage();

    //Render bookmark
    bookmarkView.render(model.state.bookmarks);

    //Change id in url
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC);
  } catch (err) {
    console.error('????', err);
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controllerRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
