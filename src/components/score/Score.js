import { Lightning } from '@lightningjs/sdk'

import { Colors } from '../../utils/Styles'

export class Score extends Lightning.Component {
  static _template() {
    return {
      ScoreText: {
        text: {
          text: 'score:',
          fontFace: 'Jura',
          fontSize: 32,
          textColor: Colors.White,
          shadow: true,
          shadowColor: 0xffff2222,
          shadowBlur: 3,
        }
      },
      ScoreNumber: {
        x: 0,
        y: 30,
        w: 640 - 30,
        text: {
          text: '1000000000',
          fontFace: 'Jura',
          fontSize: 90,
          textColor: Colors.White
        }
      }
    }
  }

  _init() {
    this.application.on('Score', (number) => {
      this.scoreNumber(number)
    })
  }

  scoreNumber(val) {
    const current = parseInt(this.tag('ScoreNumber').text.text)
    if (current > 10000000000) {
      // you get the max score
      // maybe I will think to show something or...
      this.tag('ScoreNumber').text.text = 9999999999 // max score
    } else {
      this.tag('ScoreNumber').text.text = current + parseInt(val)
    }
  }
}
