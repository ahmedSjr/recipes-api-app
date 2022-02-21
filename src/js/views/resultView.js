import View from './View.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';

class ResultView extends View {
  _parentEl = document.querySelector('.results');
  _errorMsg = 'No Recipes found try another name!';
  _message = '';

  _generateMarkup() {
    // console.log(this._data);

    return this._data
      .map(results => previewView.render(results, false))
      .join('');
  }
}

export default new ResultView();
