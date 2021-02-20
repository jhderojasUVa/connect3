import { Lightning, Router, Utils } from '@lightningjs/sdk'
import { Colors, SpaceBetween, ChipSize } from '../../utils/Styles'
import { Chip } from '../items/Chip'

const SmallBoardSizeW = 4 * 80 // (4 chips)
const SmallBoardSizeH = 3 * 80 // (3 chips)

export class SmallBoard extends Lightning.Component {
  // 8 x 12 (board)
  static _template() {
    return {
      w: SmallBoardSizeW,
      h: SmallBoardSizeH,
      rect: true,
      color: 0xff000000,
      HorizontalLines: {},
      VerticalLines: {},
      Chips: {},
    }
  }

  _init() {
    this._generateLines(4 * 80, SpaceBetween, 'x', this.tag('HorizontalLines'))
    this._generateLines(3 * 80, SpaceBetween, 'y', this.tag('VerticalLines'))
    this._generateChips()
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
          h: SmallBoardSizeH,
          w: 2,
          axis: 'x',
          color: Colors.White,
          rect: true,
        }
      } else {
        return {
          y: index * separation,
          w: SmallBoardSizeW,
          h: 2,
          axis: 'y',
          color: Colors.White,
          rect: true,
        }
      }
    })
  }

  _generateChips() {
    // this generate the same chips in the same positions
    let chips = [
      // 1st
      {
        chipColor: 'Blue',
      },
      {
        chipColor: 'Blue',
      },
      {
        chipColor: 'Red',
      },
      {
        chipColor: 'Red',
      },
      // 2nd
      {
        chipColor: 'Red',
        data: {
          realclear: true,
        },
      },
      {
        chipColor: 'Blue',
      },
      {
        chipColor: 'Red',
        data: {
          realclear: true,
        },
      },
      {
        chipColor: 'Red',
        data: {
          realclear: true,
        },
      },
      // 3rd
      {
        chipColor: 'White',
      },
      {
        chipColor: 'Red',
        data: {
          realclear: true,
        },
      },
      {
        chipColor: 'Green',
      },
      {
        chipColor: 'Blue',
      },
    ]

    let start = {
      x: 0,
      y: 0,
    }

    this.tag('Chips').children = chips.map((item, index) => {
      if (index > 0 && index % 4 == 0) {
        // new line!
        start.y++
      }

      return {
        w: ChipSize.w,
        h: ChipSize.h,
        x: (index % 4) * SpaceBetween,
        y: start.y * SpaceBetween,
        data: {
          ...item.data,
          index,
          x: index % 4,
          y: start.y,
          color: item.chipColor,
        },
        rect: true,
        texture: Lightning.Tools.getRoundRect(
          ChipSize.w,
          ChipSize.h,
          40,
          0,
          0xffff00ff,
          true,
          Colors[item.chipColor]
        ),
        type: Chip,
      }
    })
  }

  moveChips(oldIndex, newIndex) {
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
      //this.checkBoard() // check everything
    }, 1500)
  }

  clearChips() {
    // remove chips that must be removed and update to new ones
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
      }

      setTimeout(() => {
        element.patch({
          smooth: {
            alpha: 1,
            scale: 1,
          },
        })
      }, 2000)
    })
  }
}
