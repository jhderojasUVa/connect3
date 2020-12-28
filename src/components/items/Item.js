import { Lightning, Utils } from '@lightningjs/sdk'

export class ItemComponent extends Lightning.Component {
  static _template() {
    return {
      w: 20,
      h: 20,
    }
  }

  _setup() {
    // Id
    this._itemId = undefined
    // board location
    this._location = {
      x: 0,
      y: 0,
    }
    // next items
    this._nextToItems = {
      up: undefined,
      down: undefined,
      left: undefined,
      right: undefined
    }
    // specs
    this._color = 0
    // img
    this._img = undefined
  }

  set image(val) {
    this.src = Utils.asset(`chips/${val}`)
  }

  set color(val) {
    this.color = val
    this.rect = true
  }
}
