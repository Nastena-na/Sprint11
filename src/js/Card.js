// Передаем сюда объект.Можем брать из него все, что нужно!
export class Card {
  constructor(data, api) {
    this._card = null;
    this.data = data;
    this.api = api;
    this._like = this._like.bind(this);
    this._remove = this._remove.bind(this);
  }

  _template() {
    const templateString = `<div class="place-card">
        <div class="place-card__image">
          <button class="place-card__delete-icon"></button>
        </div>
        <div class="place-card__description">
          <h3 class="place-card__name"></h3>
          <div class="place-card__like-group">
            <button class="place-card__like-icon"></button>
            <div class="place-card__like-number"></div
          </div>
        </div>
      </div>`;
    const element = document.createElement('div');
    element.insertAdjacentHTML('beforeend', templateString.trim());
    return element.firstChild;
  }

  create() {
    this._card = this._template();
    this._card.querySelector('.place-card__name').textContent = this.data.name;
    this._card.querySelector(
      '.place-card__image'
    ).style.backgroundImage = `url(${this.data.link})`;
    this._card
      .querySelector('.place-card__image')
      .setAttribute('data-url', `${this.data.link}`);
    this._card.querySelector(
      '.place-card__like-number'
    ).textContent = `${this.data.likes.length}`;
    this._setEvent();
    return this._card;
  }
  //вешаем слушатели
  _setEvent() {
    this._card
      .querySelector('.place-card__delete-icon')
      .addEventListener('click', this._remove);
    this._card
      .querySelector('.place-card__like-icon')
      .addEventListener('click', this._like);
  }
  // удаляем слушатели
  _removeEvent() {
    this._card
      .querySelector('.place-card__delete-icon')
      .removeEventListener('click', this._remove);
    this._card
      .querySelector('.place-card__like-icon')
      .removeEventListener('click', this._like);
  }

  _like() {
    if (event.target.classList.contains('place-card__like-icon')) {
      event.target.classList.toggle('place-card__like-icon_liked');
    }
    const like = event.target.classList.contains('place-card__like-icon_liked')
      ? true
      : false;
    this.api
      .likeCard(this.data._id, like)
      .then((res) => {
        this._card.querySelector('.place-card__like-number').textContent =
          res.likes.length;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  _remove() {
    event.stopPropagation(); //прекращаем всплытие события
    const deleteConfirm = window.confirm(
      'Вы действительно хотите удалить эту карточку?'
    );
    if (deleteConfirm === true) {
      this.api
        .deleteCard(this.data._id)
        .then(() => {
          this._removeEvent();
          this._card.remove();
        })
        .catch((err) => console.log(err));
    }
  }
}
