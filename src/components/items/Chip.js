import { Lightning, Utils } from '@lightningjs/sdk'

import { ChipSize } from '../../utils/Styles'

export class Chip extends Lightning.Component {
  static _template() {
    return {
      w: ChipSize.w,
      h: ChipSize.h,
    }
  }

  set image(val) {
    // sets the icon/image (future use)
    this.src = Utils.asset(`chips/${val}`)
  }
}
