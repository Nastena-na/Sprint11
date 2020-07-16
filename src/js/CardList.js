export class CardList {
  constructor(container, callback) {
    this._container = container;
    this._callback = callback;
  }

  _addCard(card) {
    const template = this._callback(card);
    this._container.append(template.create());
  }

  render(cards) {
    cards.forEach((card) => {
      this._addCard(card);
    });
  }
}
