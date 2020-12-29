import { Lightning, Utils } from '@lightningjs/sdk'

import { Colors, SpaceBetween, ChipSize } from '../../utils/Styles'
import { Chip } from '../items/Chip'
import { Selector } from '../selector/Selector'

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
      },
      Selector: {
        type: Selector
      }
    }
  }

  _build() {
    this._music = undefined
    this._selectorIndex = 0
  }

  _init() {
    this._chips = this.tag('Chips')
    this._selector = this.tag('Selector')
  }


  _active() {
    this._chipsChildren = this.tag('Chips').children
    this._generateLines(643, SpaceBetween, 'x', this.tag('HorizontalLines'))
    this._generateLines(965, SpaceBetween, 'y', this.tag('VerticalLines'))
    this._generateChips()

    this.checkChipsRow()
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
    for (let i = 0; i < 96; i++) {
      chips.push(i)
    }

    let start = {
      x: 0,
      y: 0,
    }

    this.tag('Chips').children = chips.map((item, index) => {
      // random chip color!
      const colorName = Colors.Index[Math.floor(Math.random() * Colors.Index.length)]
      const chipColor = Colors[colorName]

      if (index > 0 && (index % 8) == 0) {
        // new line!
        start.y++
      }
      return {
        w: ChipSize.w,
        h: ChipSize.h,
        x: index % 8 * SpaceBetween,
        y: start.y * SpaceBetween,
        data: {
          index,
          x: index % 8,
          y: start.y,
          color: colorName
        },
        rect: true,
        texture: Lightning.Tools.getRoundRect(ChipSize.w, ChipSize.h, 40, 0, 0xffff00ff, true, chipColor),
        type: Chip
      }
    })
  }

  _handleLeft() {
    if (this._selectorIndex % 8 !==0) {
      this._selectorIndex--
    }
    this.moveSelector(this._selectorIndex)
  }

  _handleRight() {
    if (this._selectorIndex % 8 !== 7) {
      this._selectorIndex++
    }
    this.moveSelector(this._selectorIndex)
  }

  _handleUp() {
    if (this._selectorIndex >= 8) {
      this._selectorIndex = this._selectorIndex - 8
    }
    this.moveSelector(this._selectorIndex)
  }

  _handleDown() {
    if (this._selectorIndex < 96 - 8) {
      this._selectorIndex = this._selectorIndex + 8
    }
    this.moveSelector(this._selectorIndex)
  }

  moveSelector(index) {
    // selector movement
    this._selector.patch({
      x: (index % 8) * SpaceBetween,
      y: (index < 8) ? 0 : Math.floor(index / 8) * SpaceBetween
    })
    // check chips
    this.checkChipsRow()
  }

  returnXY(index) {
    // this will return the x, y position of an index
    // x also a column
    // y also a row
    return {
      x: index % 8,
      y: Math.floor(index / 8)
    }
  }

  returnIndex(x, y) {
    // return the index of an x, y position
    return (x + 1) * (y + 1)
  }

  checkChipsCoincidences(minindex = 0, maxindex = 8, coincidences = 0) {
    const index = minindex % 8 // index translation
    const nextIndex = minindex + 1
    // current
    let currentColor = this.tag('Chips').children[minindex].data.color
    // next
    let nextColor
    if (this.tag('Chips').children[nextIndex] && index <= maxindex) {
      nextColor = this.tag('Chips').children[nextIndex].data.color
    } else {
      nextColor = undefined
    }

    if (nextIndex < 96) {
      if (currentColor == nextColor) {
        // mark them
        this.tag('Chips').children[minindex].data.clear = true
        this.checkChipsCoincidences(nextIndex, 8, coincidences + 1)
      } else {
        if (coincidences >= 3) {
          // clear
          console.log('Clear!')
          this.clearChips()
        } else {
          this.checkChipsCoincidences(nextIndex, 8, 0)
        }
      }
    }
  }

  checkChipsRow(row = 0) {
    for (row; row < 12; row++) {
      this.checkChipsCoincidences(row * 8)
    }
  }

  checkChipsColumn(column = 0) {
    for (column; column < 8; column++) {

    }
  }


  clearChips() {
    this.tag('Chips').children.forEach((element, index) => {
      if (element.data.clear == true) {
        console.log(element.data)
        element.alpha = 0
      }
    })
  }
}
