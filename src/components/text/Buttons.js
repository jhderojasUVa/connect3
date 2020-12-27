import { Lightning } from '@lightningjs/sdk'
import { Colors } from '../../utils/Styles'

export class ButtonText extends Lightning.Component {
    static _template() {
        return {
            ButtonText: {
                text: {
                    fontFamily: 'Jura',
                    textColor: Colors.Black,
                    text: 'asdadasdads',
                    textAlign: 'center'
                }
            }
        }
    }

    _init() {
    }

    set size(size) {
        this.tag('ButtonText').w = size.w,
        this.h = size.h,
        this.tag('ButtonText').text.w = size.w
    }

    set title(text) {
        console.log(text)
        this.tag('ButtonText').text.text = text
    }

    _focus() {
        console.log('Button Focus')
        this.buttonAnimation = this.animation({
            duration: 1,
            repeat: -1,
            stopMethod: 'inmediate',
            actions: [
                { p: 'y', v: {0: -10, 0.5: 0, 1: 10}}
            ]
        })
        this.buttonAnimation.start()
    }

    _unfocus() {
        this.buttonAnimation.stop()
    }
}