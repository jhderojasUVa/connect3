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
        },
      },
      ScoreNumber: {
        x: 0,
        y: 30,
        w: 640 - 30,
        text: {
          text: '0',
          fontFace: 'Jura',
          fontSize: 90,
          textColor: Colors.White,
        },
      },
    }
  }

  _init() {
    this.application.on('Score', number => {
      this.scoreNumber(number)
    })
  }

  scoreNumber(val) {
    const current = parseInt(this.tag('ScoreNumber').text.text)
    let newScore
    if (current > 10000000000) {
      // you get the max score
      // maybe I will think to show something or...
      newScore = 9999999999
    } else {
      newScore = current + parseInt(val)
    }

    this.tag('ScoreNumber').text.text = newScore
    this._score = newScore
  }

  get score() {
    return this._score
  }
}
