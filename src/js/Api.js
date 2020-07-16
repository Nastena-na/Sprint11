export class Api {
  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
  }

  getResult(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  // Получение данных о пользователе с сервера
  getUserInfo() {
    return fetch(`${this._url}/users/me`, {
      method: 'GET',
      headers: this._headers,
    }).then(this.getResult);
  }

  // Загрузка карточкек с сервера
  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      method: 'GET',
      headers: this._headers,
    }).then(this.getResult);
  }

  // Обновление данных профиля на сервере
  patchUser(nameInput, aboutInput) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: nameInput,
        about: aboutInput,
      }),
    }).then(this.getResult);
  }

  // Добавление новой карточки на сервер
  postNewCard(nameNew, linkNew) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: nameNew,
        link: linkNew,
      }),
    }).then(this.getResult);
  }

  // Удаление карточки с сервера
  deleteCard(id) {
    return fetch(`${this._url}/cards/${id}`, {
      method: 'DELETE',
      headers: this._headers,
    }).then(this.getResult);
  }

  // Добавление/снятие "лайка"
  likeCard(id, isLiked) {
    // method -- это логический флаг(isLiked)
    isLiked === true ? (this.method = 'PUT') : (this.method = 'DELETE');
    return fetch(`${this._url}/cards/like/${id}`, {
      method: this.method,
      headers: this._headers,
    }).then(this.getResult);
  }

  // Обновление аватара
  patchAvatar(link) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: link,
      }),
    }).then(this.getResult);
  }
}
