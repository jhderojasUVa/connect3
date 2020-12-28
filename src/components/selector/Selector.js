import { Lightning } from '@lightningjs/sdk'

import { Colors } from '../../utils/Styles'

export class Selector extends Lightning.Component {
  static _template() {
    return {
      colorTop: Colors.Blue,
      colorBottom: Colors.Red,
      TopLeft: {
        x: 5,
        y: 5,
        Cross: {
          type: HalfCross
        }
      },
      TopRight: {
        x: 80 - 5,
        y: 5,
        Cross: {
          type: HalfCross,
          rotation: Math.PI / 2
        }
      },
      BottomLeft: {
        x: 5,
        y: 80 - 5,
        Cross: {
          type: HalfCross,
          rotation: 3 * Math.PI / 2
        }
      },
      BottomRight: {
        x: 80 - 5,
        y: 80 - 5,
        Cross: {
          type: HalfCross,
          rotation: Math.PI
        }
      }
    }
  }

  _active() {
    this.blink()
  }

  blink() {
    this._blink = this.animation({
      duration: 0.5,
      repeat: -1,
      stopMethod: 'inmediate',
      actions: [
        {
          p: 'alpha',
          v: {
            0: 0,
            0.5: 1,
            1: 0
          }
        }
      ]
    })
    this._blink.start()
  }
}

class HalfCross extends Lightning.Component {
  static _template() {
    return {
      Line1: {
        w: 20,
        h: 5,
        color: Colors.White,
        rect: true
      },
      Line2: {
        w: 5,
        h: 20,
        color: Colors.White,
        rect: true,
      }
    }
  }
}
