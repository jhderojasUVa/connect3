import { Lightning } from '@lightningjs/sdk'

import { Colors } from '../../utils/Styles'

export class Score extends Lightning.Component() {
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
        x: 350,
        text: {
          text: '0',
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

  set scoreNumber(val) {
    const current = parseInt(this.tag('ScoreNumber').text.text)
    this.tag('ScoreNumber').text.text = current + parseInt(val)
  }
}
