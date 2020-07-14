'use strict';

class Popup {
  constructor(popup) {
    this._popup = popup;
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this._popup
      .querySelector('.popup__close')
      .addEventListener('click', this.close);
  }

  open() {
    this._popup.classList.add('popup_is-opened');
  }

  close() {
    this._popup.classList.remove('popup_is-opened');
    this._popup.querySelector('button').setAttribute('disabled', true);
  }
}
