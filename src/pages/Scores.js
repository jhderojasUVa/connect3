import { Lightning, Storage, Utils, Router } from '@lightningjs/sdk'
import { Howl, Howler } from 'howler'
import { Column } from 'lightning-ui-components'

import { DefaultHighScores } from '../utils/DefaultHighScores'
import { ScoresMusic } from '../utils/Music'
import { Colors } from '../utils/Styles'

import { MovingBackground } from '../components/movingbackground/MovingBackground'
import { ScoreUser } from '../components/score/ScoreUser'

import { Keyboard } from '../components/keyboard/Keyboard'

export class ScoresPage extends Lightning.Component {
  static _template() {
    return {
      Background: {
        type: MovingBackground,
      },
      HallofFame: {
        w: 1920,
        text: {
          text: 'Hall of fame',
          fontSize: 90,
          textColor: 0xff00cc22,
          fontFace: 'Indie',
          textAlign: 'center',
          shadow: true,
          shadowBlur: 20,
          shadowColor: Colors.Yellow,
        },
      },
      ScoreBoardBase: {
        x: 580,
        y: 140,
        w: 750,
        h: 800,
        color: 0x22ffffff,
        rect: true,
      },
      ScoreBoard: {
        x: 600,
        y: 150,
        type: Column,
      },
      UserKeyboard: {
        y: 950,
        alpha: 0,
        type: Keyboard,
      },
      UserName: {
        w: 1920,
        y: 1080 / 2 - 100,
        alpha: 0,
        text: {
          text: '',
          textAlign: 'center',
          fontSize: 200,
          textColor: Colors.White,
          shadow: true,
          shadowBlur: 30,
          shadowColor: Colors.Red,
        },
      },
    }
  }

  _setup() {
    this._index = 0 // highscore index //TODO REFACTOR!
    this._music = new Howl({
      src: Utils.asset(`music/${ScoresMusic}`),
      autoplay: true,
      loop: true,
    })
  }

  _init() {
    this._highScores =
      Storage.get('highscores') === null
        ? (this._highScores = DefaultHighScores())
        : Storage.get('highscores')
  }

  _active() {
    // restart everything
    this._setState('HideKeyboard')

    this.tag('ScoreBoard').items = this._highScores.map((element, index) => {
      const colorName = Colors.Index[Math.floor(Math.random() * Colors.Index.length)]
      const chipColor = Colors[colorName]
      return {
        data: {
          ...element,
          colorName: colorName,
          color: chipColor,
        },
        type: ScoreUser,
      }
    })
    Howler.stop()
    this._music.play()
  }

  _inactive() {
    this._music.stop()
  }

  set newScore(val) {
    this._newscore = val
    this.addNewScore(val)
  }

  addNewScore(val, index = 0) {
    this._index = index
    if (val > this._highScores[index].score) {
      this._setState('ShowKeyboard')
    } else {
      if (index + 1 < this._highScores.length) {
        this.addNewScore(val, index + 1)
      }
    }
    this._setState('HideKeyboard')
  }

  startKeyboard(val) {
    console.log(val)
    if (val === true) {
      console.log('val', val)
      this.tag('UserKeyboard').patch({
        smooth: {
          alpha: 1,
        },
      })
      this.tag('UserName').alpha = 1
    } else {
      // console.log('adsadasda')
      this.tag('UserKeyboard').patch({
        smooth: {
          alpha: 0,
        },
      })
      this.tag('UserName').alpha = 0
    }
  }

  pageTransition() {
    return 'crossFade'
  }

  static _states() {
    return [
      class ShowKeyboard extends this {
        $enter() {
          console.log('Enter keyboard')
          this.startKeyboard(true)
        }
        _getFocused() {
          console.log('getfocused enter keyboard')
          // return this.tag('UserKeyboard')
        }
      },
      class HideKeyboard extends this {
        $enter() {
          this._index = 0
          this.tag('UserName').alpha = 0
          this.tag('UserName').text.text = ''
          this.startKeyboard(false)
        }
        /*_getFocused() {
          return this
        }*/
      },
    ]
  }

  $scoreKeyPressed(letter) {
    this.tag('UserName').alpha = 1
    const oldLetters = this.tag('UserName').text.text

    this.tag('UserName').text.text = oldLetters + letter
    if (this.tag('UserName').text.text.length >= 3) {
      this._highScores[this.index] = {
        name: this.tag('UserName').text.text,
        score: this._newscore,
      }
      // this.startKeyboard()
      Storage.set('highscores', this._highScores)
      Router.navigate('scores')
    }
  }

  _getFocused() {
    return this.tag('UserKeyboard')
  }
}
