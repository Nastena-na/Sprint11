export class UserInfo {
  constructor(nameElem, jobElem, avatarElem, inputName, inputJob) {
    this._nameElem = nameElem;
    this._jobElem = jobElem;
    this._avatarElem = avatarElem;
    this._inputName = inputName;
    this._inputJob = inputJob;
  }

  setUserInfo(newName, newJob) {
    //новые значения,которые получили с сервера
    this._inputName = newName;
    this._inputJob = newJob;
  }

  updateUserInfo() {
    //записываем на странице, обновляем DOM
    this._nameElem.textContent = this._inputName;
    this._jobElem.textContent = this._inputJob;
  }

  setNewFoto(link) {
    this._avatarElem.style.backgroundImage = `url(${link})`;
  }

  editInputsUserInfo() {
    // вносит информацию из DOM  в поля формы
    return {
      name: this._inputName,
      job: this._inputJob,
    };
  }
}
