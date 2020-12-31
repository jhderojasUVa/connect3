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
    //console.log(this)
  }

  _setup() {
  }

  set image(val) {
    this.src = Utils.asset(`chips/${val}`)
  }
}
