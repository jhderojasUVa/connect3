import { Lightning, Router, Utils } from '@lightningjs/sdk'
import { Howl, Howler } from 'howler'

import { InstructionsMusic } from '../utils/Music'
import { InstructionBackground } from '../utils/Styles'

import { Colors, SpaceBetween, ChipSize } from '../utils/Styles'
import { SmallBoard } from '../components/board/SmallBoard'
import { Selector } from '../components/selector/Selector'

import { Toast } from '../components/toast/Toast'

const initSelector = {
  x: 252,
  y: 50,
}

export class InstructionsPage extends Lightning.Component {
  static _template() {
    return {
      Background: {
        w: 1922,
        h: 1082,
        src: Utils.asset(InstructionBackground),
      },
      Step1: {
        y: 50,
        alpha: 1,
        Board: {
          x: 250,
          y: 0,
          type: SmallBoard,
        },
        Selector: {
          x: initSelector.x,
          type: Selector,
        },
        Instructions: {
          x: 600,
          y: 90,
          w: 1000,
          text: {
            fontFamily: 'Jura',
            textColor: Colors.Black,
            text:
              'Use the selector (with the arrow keys) to move between it the chips on the board.',
            textAlign: 'left',
            shadow: true,
          },
        },
      },
      Step2: {
        alpha: 1,
        y: 350,
        Board: {
          x: 250,
          y: 0,
          type: SmallBoard,
        },
        Selector: {
          x: initSelector.x + 80,
          y: 80 * 2,
          type: Selector,
        },
        Instructions: {
          x: 600,
          y: 90,
          w: 1000,
          text: {
            fontFamily: 'Jura',
            textColor: Colors.Black,
            text: 'Press enter or select to choose and arrows to move the chip position.',
            textAlign: 'left',
            shadow: true,
          },
        },
      },
      Step3: {
        alpha: 1,
        y: 650,
        Board: {
          x: 250,
          y: 0,
          type: SmallBoard,
        },
        Instructions: {
          x: 600,
          y: 90,
          w: 1000,
          text: {
            fontFamily: 'Jura',
            textColor: Colors.Black,
            text: 'If three or more are on the same color, will dissapear',
            textAlign: 'left',
            shadow: true,
          },
        },
      },
      BackToHome: {
        y: 1000,
        x: 1150,
        text: {
          fontFamily: 'Jura',
          textColor: Colors.Black,
          text: 'Press BACK to return to the home screen',
          shadow: true,
        },
      },
      Toast: {
        x: 50,
        y: 1080 - 200,
        type: Toast,
      },
    }
  }

  _active() {
    // General audio stop!
    Howler.stop()
    // load soundtrack
    this._music = new Howl({
      src: Utils.asset(`music/${InstructionsMusic.src}`),
      autoplay: false,
      loop: true,
    })

    this._music.play()

    // music toast!
    this.tag('Toast').data = InstructionsMusic.name

    // step 1 movement
    this._initSelectorMovement('step1')
    setInterval(() => {
      this._initSelectorMovement('step1')
    }, 5000)
    // step 2 movenent
    this._initSelectorMovement('step2')
    setInterval(() => {
      this._initSelectorMovement('step2')
    }, 5000)
    // step 3 movement
    setInterval(() => {
      this._initSelectorMovement('step3')
    }, 5000)
  }

  _initSelectorMovement(step) {
    switch (step) {
      case 'step1':
        this.tag('Step1.Selector').patch({
          smooth: {
            x: [initSelector.x + 80, { duration: 0.5, delay: 0 }],
          },
        })
        this.tag('Step1.Selector').patch({
          smooth: {
            y: [80, { duration: 0.5, delay: 1 }],
          },
        })
        setTimeout(() => {
          this.tag('Step1.Selector').patch({
            smooth: {
              x: [initSelector.x, { duration: 0.5, delay: 0 }],
            },
          })
          this.tag('Step1.Selector').patch({
            smooth: {
              y: [0, { duration: 0.5, delay: 1 }],
            },
          })
        }, 2000)
        break
      case 'step2':
        this.tag('Step2.Selector')._setState('Selected')
        // move chips
        setTimeout(() => {
          this.tag('Step2.Selector').patch({
            smooth: {
              y: 80,
            },
          })
          this.tag('Step2.Board').moveChips(9, 5)
        }, 1500)

        setTimeout(() => {
          this.tag('Step2.Selector').patch({
            smooth: {
              y: 160,
            },
          })
          this.tag('Step2.Board').moveChips(9, 5)
        }, 4500)
        break
      case 'step3':
        this.tag('Step3.Board').moveChips(9, 5)
        this.tag('Step3.Board').clearChips()
        setTimeout(() => {
          this.tag('Step3.Board').moveChips(9, 5)
        }, 2500)
        break
    }
  }

  _handleBack() {
    Router.navigate('home')
  }

  pageTransition() {
    return 'crossFade'
  }
}
