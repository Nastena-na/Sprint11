export class FormValidator {
  constructor(form) {
    this._form = form;
    this._button = this._form.querySelector('button');
    this._inputs = [...this._form.querySelectorAll('input')];
    this._validate = this._validate.bind(this);
  }

  _checkInputValidity(input) {
    const error = input.parentNode.querySelector(`#${input.id}-error`);
    const errorMessages = {
      validationLength: 'Должно быть от 2 до 30 символов',
      requiredInput: 'Это обязательное поле',
      validationType: 'Здесь должна быть ссылка',
    };

    if (input.validity.typeMismatch) {
      error.classList.add('popup__error_active');
      input.setCustomValidity(errorMessages.validationType);
      error.textContent = input.validationMessage;
      return false;
    }

    if (input.validity.valueMissing) {
      error.classList.add('popup__error_active');
      input.setCustomValidity(errorMessages.requiredInput);
      error.textContent = input.validationMessage;
      return false;
    }
    if (input.validity.tooShort || input.validity.tooLong) {
      error.classList.add('popup__error_active');
      input.setCustomValidity(errorMessages.validationLength);
      error.textContent = input.validationMessage;
      return false;
    } else {
      error.classList.remove('popup__error_active');
      input.setCustomValidity('');
      error.textContent = input.validationMessage;
      return true;
    }
  }

  cleanError(errors) {
    errors = this._form.querySelectorAll('.popup__error');
    errors.forEach((er) => (er.textContent = ''));
  }

  setEventListeners() {
    this._form.addEventListener('input', this._validate);
  }

  _validate(evt) {
    this._checkInputValidity(evt.target);
    this.setSubmitButtonState(this._form.checkValidity());
  }

  setSubmitButtonState(isValidForm) {
    if (isValidForm) {
      this._button.removeAttribute('disabled');
    } else {
      this._button.setAttribute('disabled', true);
    }
  }
}
