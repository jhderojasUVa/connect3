import { Lightning, Utils } from '@lightningjs/sdk'

import { Colors, SpaceBetween, ChipSize } from '../../utils/Styles'
import { BOARDSIZE } from '../../utils/Board'
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
    this.checkChipsColumn()
    this.clearChips()
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
    if (this._selectorIndex % 8 !== 0) {
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

  _handleEnter() {
    // debug mode!
    console.log(this.tag('Chip').children(this._selectorIndex))
  }

  moveSelector(index) {
    // selector movement
    this._selector.patch({
      x: (index % 8) * SpaceBetween,
      y: (index < 8) ? 0 : Math.floor(index / 8) * SpaceBetween
    })
    // check chips
    this.checkChipsRow()
    this.clearChips()
    this.checkChipsColumn()
    this.clearChips()
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

  returnColorChip(index, maxindex) {
    // return the color of a chip with certain index (for cheking next chip color)
    if (this.tag('Chips').children[index] && index <= maxindex) {
      return this.tag('Chips').children[index].data.color
    } else {
      return undefined
    }
  }

  checkChipsCoincidences(minindex = 0, maxindex = Board.columns, coincidences = 0, axis = 'x') {
    let index, nextIndex, nextColor, currentColor
    switch (axis) {
      case 'x':
        index = minindex % 8 // index translation
        nextIndex = minindex + 1
        // current
        currentColor = this.tag('Chips').children[minindex].data.color
        // next (nextColor)
        nextColor = this.returnColorChip(nextIndex, maxindex)
        if (nextIndex < BOARDSIZE.index) {
          if (currentColor == nextColor) {
            // mark them
            this.markChipAsTmpClear(minindex)
            this.checkChipsCoincidences(nextIndex, 8, coincidences + 1, 'x')
          } else {
            if (coincidences >= 2) {
              // clear
              this.markChipAsTmpClear(minindex)
              this.markTmpClearChipsAsClear()
              console.log('Clear X!')
            } else {
              this.unClearChips()
              this.checkChipsCoincidences(nextIndex, 8, 0, 'x')
            }
          }
        }
        break
      case 'y':
        nextIndex = minindex + 8
        currentColor = this.tag('Chips').children[minindex].data.color
        // next (nextColor)
        nextColor = this.returnColorChip(nextIndex, BOARDSIZE.index)
        console.log( `precoin ${coincidences} >> cu ${minindex}=${currentColor} | next${nextIndex}=${nextColor} ` )
        if (nextIndex < BOARDSIZE.index - 8) { // end of the board!
          if (currentColor == nextColor) {
            // mark them
            this.markChipAsTmpClear(minindex)
            this.checkChipsCoincidences(nextIndex, Board.index, coincidences + 1, 'y')
          } else {
            if (coincidences >= 2) {
              // clear the current one
              //this.tag('Chips').children[minindex].data.tmpclear = true
              this.markChipAsTmpClear(minindex)
              console.log('Clear Y!')
              // mark all clear to real clear chips
              this.markTmpClearChipsAsClear()
            } else {
              // remove old marked as clear chips
              this.unClearChips()
              this.checkChipsCoincidences(nextIndex, Board.index, 0, 'y')
            }
          }
        }
        break
    }
  }

  checkChipsRow(row = 0) {
    for (row; row < 12; row++) {
      this.checkChipsCoincidences(row * 8, 8, 0, 'x')
    }
  }

  checkChipsColumn(column = 0) {
    for (column; column < 8; column++) {
      this.checkChipsCoincidences(column, 96, 0, 'y')
    }
  }

  markChipAsTmpClear(index) {
    this.tag('Chips').children[index].data.tmpclear = true
  }

  markTmpClearChipsAsClear() {
    this.tag('Chips').children.forEach((element) => {
      if (element.data.tmpclear == true) {
        element.data.realclear = true
      }
    })
  }

  unClearChips() {
    this.tag('Chips').children.forEach((element, index) => {
      element.data.tmpclear = null
    })
  }

  clearChips() {
    // clear real chips
    this.tag('Chips').children.forEach((element, index) => {
      if (element.data.realclear == true) {
        console.log(element.data)
        element.color = 0xFF000000
        //element.alpha = 0
      }
    })
  }
}
