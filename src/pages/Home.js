import { Lightning, Router, Utils } from '@lightningjs/sdk'
import { Howl, Howler } from 'howler'

import { HomeMusic } from '../utils/Music'

import { Column } from 'lightning-ui-components'

import { ButtonText } from '../components/text/Buttons'

export class HomePage extends Lightning.Component {
    static _template() {
        return {
            Background: {
                x: 0, y: 0, w: 1920, h: 1080,
                colorTop: 0xFFffffff,
                colorBottom: 0xFFcccccc,
                rect: true,
            },
            Title: {
                w: 1920,
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
    }

    _active() {
        // load soundtrack
        this._music = new Howl({
            src: [Utils.asset(`music/${HomeMusic}`)], // https://www.playonloop.com/freebies-download/
            autoplay: true,
            loop: true,
        })
        this._music.play()

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
}
