import { Lightning, Utils } from '@lightningjs/sdk'

import { Colors, SpaceBetween, ChipSize } from '../../utils/Styles'
import { Chip } from '../items/Chip'

export class Board extends Lightning.Component {
  // 8 x 12 (board)
  static _template() {
    return {
      w: 643,
      h: 963,
      HorizontalLines: {

      },
      VerticalLines: {

      },
      Chips: {
      }
    }
  }

  _build() {
    this._music = undefined
  }


  _active() {
    this._generateLines(643, SpaceBetween, 'x', this.tag('HorizontalLines'))
    this._generateLines(965, SpaceBetween, 'y', this.tag('VerticalLines'))
    this._generateChips()
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

  _generateChips() {
    let chips = []
    for (let i = 0; i < 104; i++) {
      chips.push(i)
    }

    let start = {
      x: 0,
      y: 0,
    }

    this.tag('Chips').children = chips.map((item, index) => {
      // random chip color!
      const chipColor = Colors.Index[Math.floor(Math.random() * Colors.Index.length)]

      if (index > 8 && (index % 8) == 0) {
        // new line!
        start.y++
      }
      return {
        index: index,
        w: ChipSize.w,
        h: ChipSize.h,
        x: index % 8 * SpaceBetween,
        y: start.y * SpaceBetween,
        data: {
          x: index % 8,
          y: start.y,
          color: chipColor
        },
        //color: Colors[chipColor],
        rect: true,
        texture: Lightning.Tools.getRoundRect(ChipSize.w, ChipSize.h, 40, 0, 0xffff00ff, true, Colors[chipColor]),
        type: Chip
      }
    })
  }
}
