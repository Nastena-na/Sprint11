import './pages/index.css';
import { Card } from './js/Card';
import { CardList } from './js/CardList';
import { Popup } from './js/Popup';
import { BigImage } from './js/BigImage';
import { UserInfo } from './js/UserInfo';
import { FormValidator } from './js/FormValidator';
import { Api } from './js/Api';

(function () {
  // DOM-элементы
  const placesList = document.querySelector('.places-list');

  const userInfoButton = document.querySelector('.user-info__button'); //кнопка "+"
  const editButton = document.querySelector('.edit__button'); //кнопка "Edit"

  const popup = document.querySelector('.popup'); //попап "Новое место"
  const editPopup = document.querySelector('.edit__popup'); //попап "Редактировать"
  const avatarPopup = document.querySelector('.avatar__popup'); //попап "Аватар"
  const imagePopup = document.querySelector('.bigImage__popup'); // Большая картинка

  const formNew = document.forms.new;
  const formEdit = document.forms.edit;
  const formAvatar = document.forms.avatar;
  const inputTitle = formNew.elements.name;
  const inputLink = formNew.elements.link;
  const inputName = formEdit.elements.user;
  const inputJob = formEdit.elements.job;
  const inputAvatar = formAvatar.elements.urlAvatar;

  const userName = document.querySelector('.user-info__name');
  const userJob = document.querySelector('.user-info__job');
  const userPhoto = document.querySelector('.user-info__photo');

  const buttonPlaceSubmit = document.querySelector('.popup__button_type_place');
  const buttonUserSubmit = document.querySelector('.popup__button_type_user');
  const buttonAvatarSubmit = document.querySelector(
    '.popup__button_type_avatar'
  );

  const serverUrl =
    NODE_ENV === 'production' ? 'https://praktikum.tk' : 'http://praktikum.tk';

  const config = {
    url: `${serverUrl}/cohort11`,
    headers: {
      authorization: 'e7c47a46-a800-41a0-9207-658ce4c95ce5',
      'Content-Type': 'application/json',
    },
  };

  // Экземпляры классов
  const popupOne = new Popup(popup);
  const popupTwo = new Popup(editPopup);
  const popupThree = new BigImage(imagePopup);
  const popupFour = new Popup(avatarPopup);
  const userInfo = new UserInfo(
    userName,
    userJob,
    userPhoto,
    inputName,
    inputJob
  );
  const popupValidator = new FormValidator(formNew);
  const editPopupValidator = new FormValidator(formEdit);
  const avatarPopupValidator = new FormValidator(formAvatar);
  const api = new Api(config);
  // Создадим стрелочную функцию, которая будет каждый раз создавать !new Card! со всеми аргументами,
  // и добавим сюда api для дальнейших действией с сервером
  const createPlace = (...args) => new Card(...args, api);
  const cardList = new CardList(placesList, createPlace);

  // Функции
  function openNewPlace() {
    // открываем попап "Новое место"
    popupValidator.cleanError();
    formNew.reset();
    popupOne.open();
    popupValidator.setEventListeners();
  }

  function openEditPopup() {
    // открываем попап "Редактировать профиль"
    userInfo.setUserInfo(userName.textContent, userJob.textContent);
    const getUserInfo = userInfo.editInputsUserInfo();
    inputName.value = getUserInfo.name;
    inputJob.value = getUserInfo.job;
    editPopupValidator.cleanError();
    editPopupValidator.setSubmitButtonState(true);
    popupTwo.open();
    editPopupValidator.setEventListeners();
  }

  function openBigImage(event) {
    //открываем попап с большой картинкой
    event.preventDefault();
    if (event.target.classList.contains('place-card__image')) {
      popupThree.open();
    }
  }

  function openAvatarPopup() {
    // открываем попап "Редактировать аватар"
    avatarPopupValidator.cleanError();
    avatarPopupValidator.setSubmitButtonState(false);
    formAvatar.reset();
    popupFour.open();
    avatarPopupValidator.setEventListeners();
  }

  function renderLoading(button, isLoading) {
    // кнопка "сабмит" меняется на "загрузку"
    if (isLoading) {
      button.textContent = 'Загрузка';
      button.classList.add('popup__button_loader');
    } else {
      button.textContent = 'Сохранить';
      button.classList.remove('popup__button_loader');
    }
  }

  function addNewPlace(evt) {
    // создаём новую карточку
    evt.preventDefault();
    renderLoading(buttonPlaceSubmit, true);
    api
      .postNewCard(inputTitle.value, inputLink.value)
      .then((data) => {
        cardList._addCard(data);
        formNew.reset();
        popupOne.close();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        renderLoading(buttonPlaceSubmit, false);
      });
  }

  function editProfile(evt) {
    //меняем данные профиля
    evt.preventDefault();
    renderLoading(buttonUserSubmit, true);
    api
      .patchUser(inputName.value, inputJob.value) // отправили поля
      .then((res) => {
        userInfo.setUserInfo(res.name, res.about); // получили поля
        userInfo.updateUserInfo(); // отрисовали поля
        popupTwo.close();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        renderLoading(buttonUserSubmit, false);
      });
  }

  function editAvatar(evt) {
    //меняем данные аватара
    evt.preventDefault();
    renderLoading(buttonAvatarSubmit, true);
    api
      .patchAvatar(inputAvatar.value)
      .then((res) => {
        userInfo.setNewFoto(res.avatar);
        popupFour.close();
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        renderLoading(buttonAvatarSubmit, false);
      });
  }

  // Слушатели
  formNew.addEventListener('submit', addNewPlace);

  formEdit.addEventListener('submit', editProfile);

  formAvatar.addEventListener('submit', editAvatar);

  userInfoButton.addEventListener('click', openNewPlace);

  editButton.addEventListener('click', openEditPopup);

  placesList.addEventListener('click', openBigImage);

  userPhoto.addEventListener('click', openAvatarPopup);

  //Получение стартовых данных юзера и стартовых карточек
  api
    .getInitialCards()
    .then((res) => {
      cardList.render(res);
    })
    .catch((err) => {
      console.log(err);
    });

  api
    .getUserInfo()
    .then((res) => {
      userInfo.setUserInfo(res.name, res.about);
      userInfo.updateUserInfo();
      userInfo.setNewFoto(res.avatar);
    })
    .catch((err) => {
      console.log(err);
    });
})();
