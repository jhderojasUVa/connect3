import { Lightning } from '@lightningjs/sdk'

import { Colors } from '../../utils/Styles'

export class GameOverLetters extends Lightning.Component {
  static _template() {
    return {
      y: -1080,
      Background: {
        x: 0, y: 0, w: 1920, h: 1080,
        color: 0x99000000, rect: true
      },
      GameOver: {
        w: 1920,
        y: (1080 / 2) - 150,
        text: {
          text: 'Game Over!',
          fontFace: 'Jura',
          textAlign: 'center',
          textColor: Colors.Red,
          shadow: true,
          shadowColor: Colors.White,
          shadowOffsetX: 5,
          shadowOffsetY: 5,
          shadowBlur: 10,
          fontSize: 120,
        }
      }
    }
  }

  set animationStart(val) {
    if (val == true) {
      this.animation()
    } else {
      this.y = -1080
    }
  }

  animation() {
    this.patch({
      smooth: { y: 0 }
    })
  }
}
