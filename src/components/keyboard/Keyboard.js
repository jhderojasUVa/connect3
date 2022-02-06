import { Lightning } from '@lightningjs/sdk'
import { Row } from '@lightningjs/ui-components'

import { Colors } from '../../utils/Styles'
import { LETTERS } from '../../utils/Lang'

export class Keyboard extends Lightning.Component {
  static _template() {
    return {
      w: 1920,
      h: 100,
      colorRight: Colors.Gray,
      colorLeft: Colors.White,
      rect: true,
      Keyboard: {
        type: Row,
      },
    }
  }

  _active() {
    this.tag('Keyboard').items = LETTERS.map(element => {
      return {
        data: element,
        type: Key,
      }
    })
  }

  _focus() {}

  _unfocus() {}

  _getFocused() {
    return this.tag('Keyboard')
  }

  _inactive() {}
}

export class Key extends Lightning.Component {
  static _template() {
    return {
      w: 100,
      h: 100,
      Box: {
        w: 100,
        h: 100,
        color: 0xcc222222,
        rect: true,
      },
      Key: {
        w: 100,
        y: 5,
        text: {
          text: '',
          textAlign: 'center',
          fontSize: 70,
        },
      },
    }
  }

  set data(val) {
    this._data = val
    this.tag('Key').text.text = val
  }

  _focus() {
    this.tag('Key').patch({
      smooth: {
        colorTop: Colors.Red,
        colorBottom: Colors.Yellow,
        scale: 1.3,
      },
    })
  }

  _unfocus() {
    this.tag('Key').patch({
      smooth: {
        color: Colors.White,
        scale: 1,
      },
    })
  }

  _handleEnter() {
    this.fireAncestors('$scoreKeyPressed', this._data)
  }
}
