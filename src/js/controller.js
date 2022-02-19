//Core js
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

const init = function () {
  recipeView.addHandlerRender(controllerRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
