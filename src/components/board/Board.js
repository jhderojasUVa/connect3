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
    //this.checkChips()
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
      const chipColor = Colors[Colors.Index[Math.floor(Math.random() * Colors.Index.length)]]

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
          color: chipColor
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
    this.checkChips()
  }

  checkChips() {
    console.log(this.checkNextChip(0, 1, 'x'))
    console.log(this.tag('Chips').children[1])
    /*this.tag('Chips').children.forEach((element, index) => {
      //console.log(element)
      const currentChip = element.data.index
      // right
      let right = this.checkNextChip(currentChip, 1, 'x')
      // left
      let left = this.checkNextChip(currentChip, -1, 'x')
      // top
      //let top = this.checkNextChip(currentChip, -1, 'y')
      // bottom
      //let bottom = this.checkNextChip(currentChip, 1, 'y')
      //console.log(right)
      console.log(left)
    });*/
  }

  checkNextChip(index, direction, axis) {
    // direction the number you will sum
    let nextChip
    switch (axis) {
      case 'x':
        if (direction == 1 && index % 8 < 8) {
          nextChip = this.tag('Chips').children[index + 1] ? this.tag('Chips').children[index + 1].data : undefined
          console.log(nextChip)
        } else if (direction == -1 && index % 8 > 0) {
          nextChip = this.tag('Chips').children[index - 1] ? this.tag('Chips').children[index - 1].data : undefined
        } else {
          nextChip = undefined
        }
        break
      case 'y':
        if (direction == 1) {
          nextChip = this.tag('Chips').children[index + 8] ? this.tag('Chips').children[index + 8].data : undefined
        } else if (direction == -1) {
          nextChip = this.tag('Chips').children[index - 8] ? this.tag('Chips').children[index - 8].data : undefined
        } else {
          nextChip = undefined
        }
        break
    }
    return nextChip ? nextChip.color : undefined
  }

  clearChips(index, axis) {

  }
}
