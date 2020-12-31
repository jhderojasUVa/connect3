import { Lightning, Utils } from '@lightningjs/sdk'
import { Howl, Howler } from 'howler'

import { Colors, SpaceBetween, ChipSize } from '../../utils/Styles'
import { BOARDSIZE } from '../../utils/Board'
import { PopSound } from '../../utils/Music'

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

    this._popSound = new Howl({
      src: [Utils.asset(`sounds/effects/${PopSound}`)], // https://www.playonloop.com/freebies-download/
      autoplay: true,
      loop: false,
    })
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
    this.clearChips()

    //this.checkChipsColumn()
    //this.clearChips()
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
    console.log(this._selectorIndex)
    console.log(this.tag('Chips').children[this._selectorIndex].data)
  }

  moveSelector(index) {
    // selector movement
    this._selector.patch({
      x: (index % 8) * SpaceBetween,
      y: (index < 8) ? 0 : Math.floor(index / 8) * SpaceBetween
    })
    // check chips & clear
    /*
    this.checkChipsRow()
    this.clearChips()
    this.checkChipsColumn()
    this.clearChips()
    */
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

  returnColorChip(index) {
    return this.tag('Chips').children[index] ? this.tag('Chips').children[index].data.color : undefined
  }

  checkChipsCoincidences(index = 0, coincidences = 0, axis = 'x') {
    switch (axis) {
      case 'x':
        this.checkXAxisChips(index, coincidences)
        break
      case 'y':
        this.checkYAxisChips(index, coincidences)
        break
    }
  }

  checkXAxisChips(index, coincidences = 0) {
    const nextIndex = index < this.tag('Chips').children.length - 1 ? index + 1 : undefined

    let nextColor = undefined
    const currentColor = this.returnColorChip(index)
    if (nextIndex) {
      nextColor = this.returnColorChip(nextIndex)
    }

    if (currentColor == nextColor) {
      if (nextIndex % 8 != 0) {
        this.markChipAsTmpClear(index)
        this.markChipAsTmpClear(nextIndex)
        if (nextIndex < this.tag('Chips').children.length - 1) {
          this.checkXAxisChips(nextIndex, coincidences + 1)
        }
      } else {
        this.removeTmpClearChips()
        this.checkXAxisChips(nextIndex, 0)
      }
    } else {
      if (coincidences >= 2) {
        this.markChipAsTmpClear(index)
        this.markTmpClearChipsAsClear()
      }
      this.removeTmpClearChips()
      if (nextIndex < this.tag('Chips').children.length - 1) {
        this.checkXAxisChips(nextIndex, 0)
      }
    }
  }

  checkYAxisChips(minindex, coincidences) {
    const nextIndex = minindex + 8
    const currentColor = this.returnColorChip(nextIndex)
    // next (nextColor)
    const nextColor = this.returnColorChip(nextIndex)
    //console.log( `precoin ${coincidences} >> cu ${minindex}=${currentColor} | next${nextIndex}=${nextColor} ` )
    if (nextIndex < BOARDSIZE.index - 8) { // end of the board!
      if (currentColor == nextColor) {
        // mark them
        this.markChipAsTmpClear(minindex)
        this.checkChipsCoincidences(nextIndex, coincidences + 1, 'y')
      } else {
        if (coincidences >= 2) {
          //console.log(`OK ${minindex}=${currentColor} ---- ${nextIndex}=${nextColor} --- ${coincidences}`)
          // put as tmp clear the current one
          this.markChipAsTmpClear(minindex)
          // mark all clear to real clear chips
          this.markTmpClearChipsAsClear()
          this.checkChipsCoincidences(nextIndex, 0, 'y')
        } else {
          // remove old marked as clear chips
          //console.log(`BAD ${minindex}=${currentColor} ---- ${nextIndex}=${nextColor}`)
          this.removeTmpClearChips()
          // go to the next
          this.checkChipsCoincidences(nextIndex, 0, 'y')
        }
      }
    }
  }

  checkChipsRow(row = 0) {
    this.checkChipsCoincidences(row, 0, 'x')
  }

  checkChipsColumn(column = 0, maxcolumn = 8) {
    for (column; column < maxcolumn; column++) {
      this.checkChipsCoincidences(column, 0, 'y')
    }
  }

  markChipAsTmpClear(index) {
    this.tag('Chips').children[index].data.tmpclear = true
  }

  markTmpClearChipsAsClear() {
    this.tag('Chips').children.forEach((element) => {
      if (element.data.tmpclear == true) {
        console.log(element.data)
        element.data.realclear = true
      }
    })
  }

  removeTmpClearChips() {
    this.tag('Chips').children.forEach((element, index) => {
      element.data.tmpclear = null
    })
  }

  clearChips() {
    // clear real chips
    this.tag('Chips').children.forEach((element, index) => {
      if (element.data.realclear == true) {
        //console.log(element.data)
        element.color = 0xFF000000
        this._popSound.play()
        //element.alpha = 0
      }
    })
  }
}
