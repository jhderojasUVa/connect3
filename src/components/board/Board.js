import { Lightning, Utils } from '@lightningjs/sdk'

import { Colors } from '../../utils/Styles'

export class Board extends Lightning.Component {
  // 8 x 12 (board)
  static _template() {
    return {
      w: 643,
      h: 963,
      HorizontalLines: {

      },
      VerticalLines: {

      }
    }
  }

  _build() {
    this._music = undefined
  }


  _active() {
    this._generateLines(643, 80, 'x', this.tag('HorizontalLines'))
    this._generateLines(965, 80, 'y', this.tag('VerticalLines'))
  }

  _generateLines(size, separation, axis, object) {
    let arrayOfLines = []
    for (let i = 0; i < (size / separation); i++) {
      arrayOfLines.push({
        index: i
      })
    }

    object.children = arrayOfLines.map((item, index) => {
      if (axis === 'x') {
        return {
          x: index * separation,
          h: 960,
          w: 2,
          axis: 'x',
          color: Colors.White,
          rect: true
        }
      } else {
        return {
          y: index * separation,
          w: 640,
          h: 2,
          axis: 'y',
          color: Colors.White,
          rect: true
        }
      }
    })
  }
}
