import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the received object to the dom
   * @param {Object | Object[]} data The data to be render ex:recipe
   * @param {boolean} [render = true] If false create a markup string
   * @returns {undefined | string} A markup string is return if render = false
   * @this {Object} View Instance
   * @author Ahmed Sirag
   * @throws Finish Implementations
   */

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    // console.log(_parentEl);
    this._parentEl.innerHTML = '';
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll('*'));

    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      //   console.log(curEl, newEl.isEqualNode(curEl));
      //Update change text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(`💥💥${newEl.firstChild?.nodeValue.trim()}`);
        curEl.textContent = newEl.textContent;
      }
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      //   console.log(newEl.attributes);
    });
  }

  //Render spinner for loading data
  renderSpinner() {
    const markup = `
  <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>`;

    this._clear();

    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMsg) {
    const markup = `
      <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>`;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
