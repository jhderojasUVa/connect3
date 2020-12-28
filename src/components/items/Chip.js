import { Lightning, Utils } from '@lightningjs/sdk'

import { Colors, ChipSize } from '../../utils/Styles'

export class Chip extends Lightning.Component {
  static _template() {
    return {
      w: ChipSize.w,
      h: ChipSize.h,
    }
  }

  _init() {
    console.log(this)
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

  set chipColor(val) {
    this.color = Colors[val]
    this.rect = true
  }

  get chipColor() {
    return this.color
  }
}
