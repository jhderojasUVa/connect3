import { Lightning, Router, Utils } from '@lightningjs/sdk'
import { Howl, Howler } from 'howler'

import { HomeMusic } from '../utils/Music'
import { BackgroundHome } from '../utils/Styles'

import { Column } from 'lightning-ui-components'

import { ButtonText } from '../components/text/Buttons'

export class HomePage extends Lightning.Component {
    static _template() {
        return {
            Background: {
                x: 0, y: 0, w: 1920, h: 1080,
                //colorTop: 0xFFffffff,
                //colorBottom: 0xFFcccccc,
                //rect: true,
                scale: 1.3,
                alpha: 0.8,
                src: Utils.asset(`images/backgrounds/${BackgroundHome}`)
            },
            Title: {
                w: 400,
                h: 200,
                rotation: -Math.PI / 7,
                x: 500,
                y: 150,
                text: {
                    fontSize: 130,
                    textColor: 0xFF00cc22,
                    fontFace: 'Indie',
                    text: 'Connect3!',
                    textAlign: 'center'
                }
            },
            GameMenu: {
              x: 1920 / 2 - 200,
              y: 1080 / 2,
              type: Column
            }
        }
    }

    _setup() {
      this._menu = this.tag('GameMenu')
      this._randomZoom = []
      for (let i = 0; i <= 9; i++) {
        this._randomZoom.push((Math.random() * 3) + 2.1)
      }
    }

    _init() {
      // Moving background
      this._backgroundAnimation = this.tag('Background').animation({
        duration: 30,
        repeat: -1,
        stopMethod: 'immediate',
        actions: [
          { p: 'rotation', v: {0: 0, 1: 2 * Math.PI } },
          { p: 'scale', v: {
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
            1: 1.3 }}
        ]
      })
      this._backgroundAnimation.start()
    }

    _active() {
        // load soundtrack
        this._music = new Howl({
            src: [Utils.asset(`music/${HomeMusic}`)], // https://www.playonloop.com/freebies-download/
            autoplay: true,
            loop: true,
        })
        this._music.play()

        // Menu items
        this._menu.items = [
          {
            type: ButtonText,
            title: 'Play!',
            size: {
              w: 500,
              h: 50,
            },
            action: 'play'
          },
          {
            type: ButtonText,
            title: 'Exit',
            size: {
              w: 500,
              h: 50,
            },
            action: 'exit'
          }
        ]
    }

    $buttonFired(event) {
      switch (event.toLowerCase()) {
        case 'play':
          this._music.stop()
          Router.navigate('game')
        case 'exit':
          // this.application.exit()
          console.log('EXIT!')
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
