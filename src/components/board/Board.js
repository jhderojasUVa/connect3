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
      HorizontalLines: {},
      VerticalLines: {},
      Chips: {},
      Selector: {
        type: Selector,
      },
    }
  }

  _build() {
    // build time
    this._selected = false // chip selected for movement
    this._selectorIndex = 0 // index selected
    this._oldselectorIndex = 0 // old index
    this._music = undefined // music

    this._popSound = new Howl({
      src: [Utils.asset(`sounds/effects/${PopSound}`)], // https://www.playonloop.com/freebies-download/
      autoplay: true,
      loop: false,
    })
  }

  _init() {
    // init time
    this._chips = this.tag('Chips')
    this._selector = this.tag('Selector')
  }

  _active() {
    // when active
    // this._chipsChildren = this.tag('Chips').children
    // generate the lines
    this._generateLines(643, SpaceBetween, 'x', this.tag('HorizontalLines'))
    this._generateLines(965, SpaceBetween, 'y', this.tag('VerticalLines'))
    // generate the chips
    this._generateChips()

    // check and clear chips
    this.checkAllCleared()
  }

  _generateLines(size, separation, axis, object) {
    // generate the lines
    let arrayOfLines = []
    for (let i = 0; i < size / separation; i++) {
      arrayOfLines.push({
        index: i,
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
          rect: true,
        }
      } else {
        return {
          y: index * separation,
          w: 640,
          h: 2,
          axis: 'y',
          color: Colors.White,
          rect: true,
        }
      }
    })
  }

  _generateChips() {
    // generate all the chips
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

      if (index > 0 && index % 8 == 0) {
        // new line!
        start.y++
      }
      return {
        w: ChipSize.w,
        h: ChipSize.h,
        x: (index % 8) * SpaceBetween,
        y: start.y * SpaceBetween,
        data: {
          index,
          x: index % 8,
          y: start.y,
          color: colorName,
        },
        rect: true,
        texture: Lightning.Tools.getRoundRect(
          ChipSize.w,
          ChipSize.h,
          40,
          0,
          0xffff00ff,
          true,
          chipColor
        ),
        type: Chip,
      }
    })
  }

  _handleLeft() {
    if (this._selectorIndex % 8 !== 0) {
      this._oldselectorIndex = this._selectorIndex
      this._selectorIndex--
    }
    this.moveSelector(this._selectorIndex)
    if (this._selected == true) {
      this.moveChips(this._oldselectorIndex, this._selectorIndex)
    }
  }

  _handleRight() {
    if (this._selectorIndex % 8 !== 7) {
      this._oldselectorIndex = this._selectorIndex
      this._selectorIndex++
    }
    this.moveSelector(this._selectorIndex)
    if (this._selected == true) {
      this.moveChips(this._oldselectorIndex, this._selectorIndex)
    }
  }

  _handleUp() {
    if (this._selectorIndex >= 8) {
      this._oldselectorIndex = this._selectorIndex
      this._selectorIndex = this._selectorIndex - 8
    }
    this.moveSelector(this._selectorIndex)
    if (this._selected == true) {
      this.moveChips(this._oldselectorIndex, this._selectorIndex)
    }
  }

  _handleDown() {
    if (this._selectorIndex < 96 - 8) {
      this._oldselectorIndex = this._selectorIndex
      this._selectorIndex = this._selectorIndex + 8
    }
    this.moveSelector(this._selectorIndex)
    if (this._selected == true) {
      this.moveChips(this._oldselectorIndex, this._selectorIndex)
    }
  }

  _handleEnter() {
    // debug mode!
    console.log(this.tag('Chips').children[this._selectorIndex].data)
    this._selected = this._selected ? false : true
    // Change selector!
    this.changeSelector()
  }

  changeSelector() {
    if (this._selected) {
      this.tag('Selector')._setState('Selected')
    } else {
      this.tag('Selector')._setState('Normal')
    }
  }

  moveSelector(index) {
    // selector movement
    this._selector.patch({
      x: (index % 8) * SpaceBetween,
      y: index < 8 ? 0 : Math.floor(index / 8) * SpaceBetween,
    })
  }

  returnXY(index) {
    // this will return the x, y position of an index
    // x also a column
    // y also a row
    return {
      x: index % 8,
      y: Math.floor(index / 8),
    }
  }

  returnIndex(x, y) {
    // return the index of an x, y position
    return (x + 1) * (y + 1)
  }

  returnColorChip(index) {
    return this.tag('Chips').children[index]
      ? this.tag('Chips').children[index].data.color
      : undefined
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

  checkYAxisChips(index, coincidences) {
    const nextIndex = index + 8 < 95 ? index + 8 : undefined

    let nextColor = undefined
    const currentColor = this.returnColorChip(index)
    if (nextIndex) {
      nextColor = this.returnColorChip(nextIndex)
    }

    if (currentColor == nextColor) {
      this.markChipAsTmpClear(index)
      this.markChipAsTmpClear(nextIndex)
      this.checkYAxisChips(nextIndex, coincidences + 1)
    } else {
      if (coincidences >= 2) {
        this.markChipAsTmpClear(index)
        this.markTmpClearChipsAsClear()
      }
      this.removeTmpClearChips()
      if (nextIndex < this.tag('Chips').children.length - 1) {
        this.checkYAxisChips(nextIndex, 0)
      }
    }
  }

  checkChipsRow(row = 0) {
    this.checkChipsCoincidences(row, 0, 'x')
  }

  checkChipsColumn(column = 0) {
    for (column; column < 12; column++) {
      this.checkChipsCoincidences(column, 0, 'y')
    }
  }

  checkAllCleared() {
    // check if everything is cleared
    this.checkChipsRow()
    this.clearChips()

    this.checkChipsColumn()
    this.clearChips()
  }

  markChipAsTmpClear(index) {
    this.tag('Chips').children[index].data.tmpclear = true
  }

  markTmpClearChipsAsClear() {
    this.tag('Chips').children.forEach(element => {
      if (element.data.tmpclear == true) {
        element.data.realclear = true
      }
    })
  }

  removeTmpClearChips() {
    this.tag('Chips').children.forEach((element, index) => {
      element.data.tmpclear = null
    })
  }

  removeRealClearChips() {
    this.tag('Chips').children.forEach(element => {
      if (element.data.realclear == true) {
        element.data.realclear = null
      }
    })
  }

  clearChips() {
    // clear real chips
    this.tag('Chips').children.forEach((element, index) => {
      if (element.data.realclear == true) {
        // animation
        element.patch({
          smooth: {
            scale: [
              1.5,
              {
                duration: 0.5,
                delay: 0.2,
                timmingFunction: 'ease-in',
              },
            ],
            alpha: [
              0,
              {
                duration: 0.6,
                delay: 0.3,
                timmingFunction: 'ease-in',
              },
            ],
          },
        })
        // sound must take some time!
        setTimeout(() => {
          this.application.emit('removedChips')
          this._popSound.play()
        }, 50)

        element.transition('alpha').on('finish', () => {
          this.randomizeChip(element.data.index)
        })
      }
    })
    this.removeRealClearChips()
    // Check again
    setTimeout(() => {
      this.checkAllCleared()
    }, 1500)
  }

  randomizeChip(index) {
    const colorName = Colors.Index[Math.floor(Math.random() * Colors.Index.length)]
    const chipColor = Colors[colorName]
    this.tag('Chips').children[index].patch({
      scale: 1,
      alpha: 1,
      data: {
        ...this.tag('Chips').children[index].data,
        color: colorName,
      },
      texture: Lightning.Tools.getRoundRect(
        ChipSize.w,
        ChipSize.h,
        40,
        0,
        0xffff00ff,
        true,
        chipColor
      ),
    })
  }

  moveChips(oldIndex, newIndex) {
    console.log(oldIndex, newIndex)
    // Remember positions
    const oldChipData = {
      data: this.tag('Chips').children[oldIndex].data,
      texture: this.tag('Chips').children[oldIndex].texture,
      x: this.tag('Chips').children[oldIndex].x,
      y: this.tag('Chips').children[oldIndex].y,
    }
    const newChipData = {
      data: this.tag('Chips').children[newIndex].data,
      texture: this.tag('Chips').children[newIndex].texture,
      x: this.tag('Chips').children[newIndex].x,
      y: this.tag('Chips').children[newIndex].y,
    }

    // movement
    // old to new
    this.tag('Chips').children[oldIndex].patch({
      smooth: {
        x: newChipData.x,
        y: newChipData.y,
      },
    })
    // new into old
    this.tag('Chips').children[newIndex].patch({
      //data: oldChipData.data,
      smooth: {
        x: oldChipData.x,
        y: oldChipData.y,
      },
    })

    // change internal data
    setTimeout(() => {
      // exchange
      // original positions but new data
      this.tag('Chips').children[oldIndex].patch({
        data: newChipData.data, // swap data
        texture: newChipData.texture, // swap colors
        x: oldChipData.x,
        y: oldChipData.y,
      })
      this.tag('Chips').children[newIndex].patch({
        data: oldChipData.data,
        texture: oldChipData.texture,
        x: newChipData.x,
        y: newChipData.y,
      })
    })

    this._selected = false // loose the selection!
    this.changeSelector()
  }
}
