import { Lightning } from '@lightningjs/sdk'
import { Colors } from '../../utils/Styles'

export class ButtonText extends Lightning.Component {
  static _template() {
    return {
      ButtonText: {
        text: {
          fontFamily: 'Jura',
          textColor: Colors.Black,
          text: '',
          textAlign: 'center',
          shadow: true,
        },
      },
    }
  }

  _build() {
    this._action = undefined
  }

  _init() {}

  set size(size) {
    ;(this.tag('ButtonText').w = size.w),
      (this.h = size.h),
      (this.tag('ButtonText').text.w = size.w)
  }

  set title(text) {
    this.tag('ButtonText').text.text = text
  }

  set action(val) {
    this._action = val
  }

  get action() {
    return this._action
  }

  _focus() {
    this.alpha = 0.5
    this.patch({
      smooth: {
        scale: 1.2,
      },
    })

    this.buttonAnimation = this.animation({
      duration: 1,
      repeat: -1,
      stopMethod: 'reverse',
      actions: [{ p: 'x', v: { 0: 0, 0.3: -10, 0.6: +10, 1: 10 } }],
    })
    this.buttonAnimation.start()
  }

  _unfocus() {
    this.alpha = 1
    this.patch({
      scale: 1,
    })

    this.buttonAnimation.stop()
  }

  _handleEnter() {
    this.fireAncestors('$buttonFired', this._action)
  }
}
