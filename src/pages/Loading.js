import { Lightning, Utils } from '@lightningjs/sdk'
import { Howl, Howler } from 'howler'

export class LoadingPage extends Lightning.Component {
    static _template() {
        return {
            Background: {
                x: 0, y: 0, w: 1920, h: 1080,
                colorTop: 0xFFffffff,
                colorBottom: 0xFFcccccc,
                rect: true,
            }
        }
    }

    init() {
        // load soundtrack
        this._music = new Howl({
            src: [Utils.asset('music/POL-net-bots-short.wav')] // https://www.playonloop.com/freebies-download/
        })
    }

    active() {
        this._music.play()
    }
}