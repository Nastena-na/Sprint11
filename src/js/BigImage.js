import { Popup } from './Popup';

export class BigImage extends Popup {
  open() {
    super.open();
    this._popup.querySelector(
      '.popup__bg-image'
    ).style.backgroundImage = `url(${event.target.dataset.url})`;
  }

  close() {
    this._popup.classList.remove('popup_is-opened');
  }
}
