import { Lightning, Utils } from '@lightningjs/sdk'

import { GameBackgrounds } from '../../utils/Styles'

export class MovingBackground extends Lightning.Component {
  static _template() {
    return {
      Background: {}
    }
  }

  _build() {
    this._interval = null
  }

  _init() {
    console.log('Background init')
  }

  _active() {
    // start movement
    this.setBackground()
    this.changeBackground()
  }

  _inactive() {
    clearInterval(this._interval)
  }

  setBackground() {
    this.tag('Background').src = Utils.asset(GameBackgrounds[Math.floor(Math.random() * (GameBackgrounds.length - 1))])
    this._animation = this.tag('Background').animation({
      duration: 45,
      repeat: -1,
      stopMethod: 'inmediate',
      actions: [
        {
          p: 'scale',
          v: {
            0: 1,
            0.3: 1.1,
            0.5: 1,
            0.7: 1.2,
            1: 1
          }
        }
      ]
    })
    this._animation.start()
  }

  changeBackground() {
    this._interval = setInterval(() => {
      this.setBackground()
    }, 45 * 10000)
  }
}
