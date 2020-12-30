import { Lightning, Utils } from '@lightningjs/sdk'
import { Howl, Howler } from 'howler'

import { HornSound } from '../../utils/Music'

import { Colors } from '../../utils/Styles'
import { MAX_TIMEBAR } from '../../utils/Board'

const BARSIZE = 500

export class TimerBar extends Lightning.Component {
  static _template() {
    return {
      Title: {
        w: BARSIZE,
        text: {
          textAlign: 'center',
          text: 'time left',
          fontFace: 'Jura',
          fontSize: 32,
          textColor: Colors.White,
          shadow: true,
          shadowColor: 0xFFff2222,
          shadowBlur: 3
        }
      },
      Timmer: {
        y: 50,
        Bar: {
          x: 3,
          y: 1,
          w: 0,
          h: 28,
          rect: true,
          color: Colors.Green
        },
        Border: {
          w: BARSIZE, // size of the time bar
          h: 30,
          texture: Lightning.Tools.getRoundRect(500, 30, 3, 5, Colors.Gray, false, 0x00000000),
        },
      }
    }
  }

  _init() {
    this._bar = this.tag('Border')
    this._progress = this.tag('Bar')

    this._timmer = null
  }

  _active() {
    this.startTimming()
  }

  startTimming() {
    this._timmer = setInterval(() => {
      const currentTime = this._progress.w
      const newTime = Math.floor(currentTime + (BARSIZE / MAX_TIMEBAR) * 1000)

      if (newTime > 250 && newTime < 350) {
        this._progress.color = Colors.Yellow
      } else if (newTime > 350 && newTime <= BARSIZE) {
        console.log(newTime)
        this._progress.color = Colors.Red
      } else if (newTime >= BARSIZE) {
        this.fireAncestors('$timeEND')
        this._hornSound = new Howl({
          src: [Utils.asset(`sounds/effects/${HornSound}`)],
          autoplay: true,
          loop: false,
        })
        this._hornSound.play()
        this.stopTimming()
      }

      if (newTime >= 500) {
        this._progress.w = 495
      } else {
        this._progress.patch({
          smooth: {
            w: newTime
          }
        })
      }
    }, 1000)
  }

  stopTimming() {
    clearInterval(this._timmer)
  }
}
