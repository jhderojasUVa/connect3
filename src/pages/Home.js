import { Lightning, Utils } from '@lightningjs/sdk'
import { Howl, Howler } from 'howler'

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
            GameOptions: {
                y: 1080 / 2,
                x: 1920 / 2,
                PlayButton: {
                    type: ButtonText,
                    title: 'Play endless game',
                    size: {
                        w: 500,
                        //h: 150,
                    }
                }
            }
        }
    }

    _init() {
        // load soundtrack
        this._music = new Howl({
            src: [Utils.asset('music/POL-net-bots-short.wav')], // https://www.playonloop.com/freebies-download/
            autoplay: true,
            loop: true,
        })
        this._music.play()
    }

    _getFocused() {
        return this.tag('PlayButton')
    }
}