import { Lightning, Utils } from '@lightningjs/sdk'
import { Howl, Howler } from 'howler'

import { HornSound, HarryUp } from '../../utils/Music'

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
          shadowColor: 0xffff2222,
          shadowBlur: 3,
        },
      },
      Timmer: {
        y: 50,
        Bar: {
          x: 3,
          y: 1,
          w: 0,
          h: 28,
          rect: true,
          color: Colors.Green,
        },
        Border: {
          w: BARSIZE, // size of the time bar
          h: 30,
          texture: Lightning.Tools.getRoundRect(500, 30, 3, 5, Colors.Gray, false, 0x00000000),
        },
      },
    }
  }

  _init() {
    // lazy!
    this._bar = this.tag('Border')
    this._progress = this.tag('Bar')

    // timmer
    this._timmer = null

    // sounds
    this._hornSound = new Howl({
      src: [Utils.asset(`sounds/effects/${HornSound}`)],
      autoplay: false,
      loop: false,
    })
    this._hurryUp = new Howl({
      src: [Utils.asset(`sounds/effects/${HarryUp}`)],
      autoplay: false,
      loop: false,
    })

    // remove time (or put more time) if you clear something (by default 30)
    this.application.on('removedChips', (quantity = 30) => {
      this.remove(quantity)
    })
  }

  remove(val) {
    const currentTime = this._progress.w
    // go back on time!
    this._progress.patch({
      smooth: {
        w: currentTime - val,
      },
    })
    // but not so back that you are below time
    if (this._progress.w < 0) {
      this._progress.patch({
        smooth: {
          w: 0,
        },
      })
    }
  }

  _active() {
    this.startTimming()
  }

  startTimming() {
    this._timmer = setInterval(() => {
      const currentTime = this._progress.w
      const newTime = Math.floor(currentTime + (BARSIZE / MAX_TIMEBAR) * 1000)

      if (newTime > 250 && newTime < 350) {
        this._hurryUp.play()
        this._progress.color = Colors.Yellow
      } else if (newTime > 380 && newTime <= BARSIZE) {
        this._progress.color = Colors.Red
      } else if (newTime >= BARSIZE) {
        this.fireAncestors('$timeEND')
        this._hornSound.play()
        this.stopTimming()
      }

      if (newTime >= 500) {
        this._progress.w = 495
      } else {
        this._progress.patch({
          smooth: {
            w: newTime,
          },
        })
      }
    }, 1000)
  }

  stopTimming() {
    clearInterval(this._timmer)
  }
}
