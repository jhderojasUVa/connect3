import { Lightning, Utils } from '@lightningjs/sdk'

import { Colors } from '../utils/Styles'
import { MusicFiles, FailMusic } from '../utils/Music'

import { MovingBackground } from '../components/movingbackground/MovingBackground'
import { TimerBar } from '../components/timer/Timer'
import { Board } from '../components/board/Board'

import { GameOverLetters } from '../components/gameover/GameOver'

export class GamePage extends Lightning.Component {
  static _template() {
    return {
      Background: {
        type: MovingBackground
      },
      Timer: {
        x: 80,
        y: 100,
        type: TimerBar,
      },
      Board: {
        x: 640,
        y: 50,
        type: Board
      },
      GameOver: {
        type: GameOverLetters
      }
    }
  }

  static _states() {
    return [
      class Normal extends this {
        $enter() {
          this.tag('Timer').visible = true
          this.tag('GameOver').visible = true
        }
        $exit() {

        }
      },
      class NoTime extends this {
        $enter() {
          this.tag('Timer').visible = false
          this.tag('GameOver').visible = false
        }
        $exit() {

        }
      }
    ]
  }

  _init() {
    this._failMusic = new Howl({
      src: Utils.asset(`sounds/effects/${FailMusic}`),
      autoplay: false,
      loop: false,
    })

  }

  _active() {
    console.log('Board initialized')
    // randomize the music order
    this._musicFiles = this._shuffle(MusicFiles)
    // play!
    this._playMusic()
  }

  _shuffle(array) {
    // shuffle the array!
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  _playMusic() {
    // put the music on!
    this._music = new Howl({
      src: this._musicFiles.map(item => {
        return Utils.asset(`music/${item}`)
      }),
      autoplay: true,
      loop: true,
    })
    this._music.play()
  }

  _getFocused() {
    return this.tag('Board')
  }

  $timeEND() {
    this._music.stop()
    this._failMusic.play()
    this.tag('GameOver').animationStart = true
  }

  set tipeOfGame(val) {
    switch (val.toLowerCase()) {
      case 'unlimited':
        this._setState('NoTime')
        break
      default:
        this._setState('Normal')
        break
    }
  }
}
