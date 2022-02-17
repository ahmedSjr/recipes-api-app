//Core js
// import { search } from 'core-js/fn/symbol';
import 'core-js/stable';
//Run time
import 'regenerator-runtime/runtime';

import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

//Request the recipes form the api

const controllerRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    //Loading recipe
    await model.loadRecipe(id);

    //Rendering the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
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
    console.log(model.state.search.results);

    //Clear the input fields
    // searchView.clearInput();
  } catch (err) {
    console.error(err);
  }
};

const init = function () {
  recipeView.addHandlerRender(controllerRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

init();
controlSearchResults();
