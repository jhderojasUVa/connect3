import { Lightning, Storage, Utils } from '@lightningjs/sdk'
import { Howl, Howler } from 'howler'
import { Column } from 'lightning-ui-components'

import { DefaultHighScores } from '../utils/DefaultHighScores'
import { ScoresMusic } from '../utils/Music'
import { Colors } from '../utils/Styles'

import { MovingBackground } from '../components/movingbackground/MovingBackground'
import { ScoreUser } from '../components/score/ScoreUser'

export class ScoresPage extends Lightning.Component {
  static _template() {
    return {
      Background: {
        type: MovingBackground
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
        type: Column
      }
    }
  }

  _setup() {
    this._music = new Howl({
      src: Utils.asset(`music/${ScoresMusic}`),
      autoplay: true,
      loop: true,
    })
  }

  _init() {
    this._highScores = Storage.get('highscores') === null ? this._highScores = DefaultHighScores() : Storage.get('highscores')
  }

  _active() {
    this.tag('ScoreBoard').items = this._highScores.map((element, index) => {
      const colorName = Colors.Index[Math.floor(Math.random() * Colors.Index.length)]
      const chipColor = Colors[colorName]
      return {
        data: {
          ...element,
          colorName: colorName,
          color: chipColor,
        },
        type: ScoreUser
      }
    })
    Howler.stop()
    this._music.play()
  }

  _inactive() {
    this._music.stop()
  }

  pageTransition() {
    return 'crossFade'
  }
}
