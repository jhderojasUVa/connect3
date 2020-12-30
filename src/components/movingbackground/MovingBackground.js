import { Lightning, Utils } from '@lightningjs/sdk'

import { GameBackgrounds } from '../../utils/Styles'

export class MovingBackground extends Lightning.Component {
  static _template() {
    return {}
  }

  _init() {
    // set backgrounds
    this.children = GameBackgrounds.map((background, index) => {
      return {
        scale: 1.3, // make it bigger than the screen
        colorRight: 0x00000000, // make it transparent to right (for continuity)
        src: background
      }
    })
  }
  
  _active() {
    // start movement
  }

  backgroundMovement() {
    this.patch({
      smooth: {
        x: []
      }
    })
  }
}
