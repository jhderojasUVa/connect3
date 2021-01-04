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
    this._onAddUser = false
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
    // Order it!
    this._highScores.sort((el1, el2) => {
      return el2.score - el1.score
    })
  }

  _active() {
    // restart everything
    this._setState('HideKeyboard')

    // check scores
    this._highScores =
      Storage.get('highscores') === null
        ? (this._highScores = DefaultHighScores())
        : Storage.get('highscores')

    // Order it!
    this._highScores.sort((el1, el2) => {
      return el2.score - el1.score
    })

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
      this._onAddUser = true
      this._setState('ShowKeyboard')
    } else {
      if (index + 1 < this._highScores.length) {
        this.addNewScore(val, index + 1)
      }
    }
    this._setState('HideKeyboard')
  }

  insertAt(index, scoreData) {
    this._highScores.splice(index, 0, scoreData)
  }

  startKeyboard(val) {
    if (this._onAddUser == true) {
      this.tag('UserKeyboard').patch({
        smooth: {
          alpha: 1,
        },
      })
      this.tag('UserName').alpha = 1
    } else {
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
      },
      class HideKeyboard extends this {
        $enter() {
          this._index = 0
          this.tag('UserName').alpha = 0
          this.tag('UserName').text.text = ''
          this.startKeyboard(false)
        }
      },
    ]
  }

  $scoreKeyPressed(letter) {
    this.tag('UserName').alpha = 1
    const oldLetters = this.tag('UserName').text.text

    this.tag('UserName').text.text = oldLetters + letter
    if (this.tag('UserName').text.text.length >= 3) {
      // TODO: refactor this!
      this.insertAt(this._index + 1, {
        name: this.tag('UserName').text.text,
        score: this._newscore,
      })
      this._highScores.length = 10
      Storage.set('highscores', this._highScores)
      this._highScores = Storage.get('highscores')
      Router.navigate('scores')
    }
  }

  _getFocused() {
    return this.tag('UserKeyboard')
  }
}
