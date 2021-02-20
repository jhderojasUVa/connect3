import { Lightning, Router, Utils } from '@lightningjs/sdk'
import { Howl, Howler } from 'howler'

import { HomeMusic } from '../utils/Music'
import { BackgroundHome } from '../utils/Styles'

import { Column } from 'lightning-ui-components'

import { FallingLetters } from '../components/fallingletters/FallingLetters'
import { ButtonText } from '../components/text/Buttons'
import { Toast } from '../components/toast/Toast'

export class HomePage extends Lightning.Component {
  static _template() {
    return {
      Background: {
        x: 0,
        y: 0,
        w: 1920,
        h: 1080,
        scale: 1.3,
        alpha: 0.8,
        src: Utils.asset(`images/backgrounds/${BackgroundHome}`),
      },
      Title: {
        x: 500,
        y: 150,
        data: 'Connect3',
        type: FallingLetters,
      },
      GameMenu: {
        x: 1920 / 2 - 200,
        y: 1080 / 2,
        type: Column,
      },
      Toast: {
        x: 50,
        y: 1080 - 200,
        type: Toast,
      },
    }
  }

  _setup() {
    this._menu = this.tag('GameMenu')
    this._randomZoom = []
    for (let i = 0; i <= 9; i++) {
      this._randomZoom.push(Math.random() * 3 + 2.1)
    }
  }

  _init() {
    // Moving background
    this._backgroundAnimation = this.tag('Background').animation({
      duration: 30,
      repeat: -1,
      stopMethod: 'immediate',
      actions: [
        { p: 'rotation', v: { 0: 0, 1: 2 * Math.PI } },
        {
          p: 'scale',
          v: {
            0: 1.3,
            0.1: this._randomZoom[0],
            0.2: this._randomZoom[1],
            0.3: this._randomZoom[2],
            0.4: this._randomZoom[3],
            0.5: this._randomZoom[4],
            0.6: this._randomZoom[5],
            0.7: this._randomZoom[6],
            0.8: this._randomZoom[7],
            0.9: this._randomZoom[8],
            1: 1.3,
          },
        },
      ],
    })
    this._backgroundAnimation.start()
  }

  _active() {
    // stop everysound!
    Howler.stop()
    // load soundtrack
    this._music = new Howl({
      src: [Utils.asset(`music/${HomeMusic.src}`)], // https://www.playonloop.com/freebies-download/
      autoplay: true,
      loop: true,
    })
    this._music.play()

    // music toast!
    this.tag('Toast').data = HomeMusic.name

    // Menu items
    this._menu.items = [
      {
        type: ButtonText,
        title: 'Play! (Time based)',
        size: {
          w: 700,
          h: 90,
        },
        action: 'play',
      },
      {
        type: ButtonText,
        title: 'Play Unlimited! (No time based)',
        size: {
          w: 700,
          h: 90,
        },
        action: 'play_unlimited',
      },
      {
        type: ButtonText,
        title: 'How to play',
        size: {
          w: 700,
          h: 90,
        },
        action: 'how_to_play',
      },
      {
        type: ButtonText,
        title: 'Exit',
        size: {
          w: 500,
          h: 90,
        },
        action: 'exit',
      },
    ]
  }

  $buttonFired(event) {
    switch (event.toLowerCase()) {
      case 'play':
        this._music.stop()
        Router.navigate('game')
        break
      case 'play_unlimited':
        this._music.stop()
        Router.navigate('game/unlimited')
        break
      case 'how_to_play':
        this._music.stop()
        Router.navigate('instructions')
        break
      case 'exit':
        this._music.stop()
        console.log('EXIT!')
        break
      default:
        return
    }
  }

  _getFocused() {
    return this.tag('GameMenu')
  }

  pageTransition() {
    return 'crossFade'
  }
}
